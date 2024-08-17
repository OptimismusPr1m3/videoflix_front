import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendCommunicationService {
  mails: any | null = [];
  signaledMail = signal<string | null>('');

  constructor(private http: HttpClient, private router: Router) {}

  // USERS_API = 'http://127.0.0.1:8000/api/users/';
  // REGISTER = 'http://127.0.0.1:8000/api/accounts/signup/';
  // LOGIN = 'http://127.0.0.1:8000/api/accounts/login/';
  // RESET_PASSWORD = 'http://127.0.0.1:8000/api/accounts/password/reset/'


  USERS_API = 'http://storage.bastian-wolff.com/api/users/';

  REGISTER = 'http://storage.bastian-wolff.com/api/accounts/signup/';

  LOGIN = 'http://storage.bastian-wolff.com/api/accounts/login/';
  LOGOUT = 'http://storage.bastian-wolff.com/api/accounts/logout/';
  RESET_PASSWORD = 'http://storage.bastian-wolff.com/api/accounts/password/reset/';
  USER_ME = 'http://storage.bastian-wolff.com/api/accounts/users/me/';

  checkMailAndRedirect(enteredMail: string | null) {
    this.http.get(this.USERS_API, { observe: 'response' }).subscribe((res) => {
      this.mails = res.body;
      const foundMail = this.mails.find(
        (mail: { email: string }) => mail.email === enteredMail
      );
      if (foundMail) {
        this.signaledMail.set(foundMail.email);
        this.router.navigate(['/login']);
      } else {
        this.signaledMail.set(enteredMail);
        console.log('Nope');
        this.router.navigate(['/registration']);
      }
    });
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(
      this.RESET_PASSWORD,
      { email: email},
      { observe: 'response'}
    );
  }

  registerUser(mail: string, password: string): Observable<any> {
    return this.http.post(
      this.REGISTER,
      { email: mail, password: password },
      { observe: 'response' }
    );
  }

  userLogin(mail: string, password:string): Observable<any> {
    return this.http.post(
      this.LOGIN,
      {email: mail, password: password},
      { observe: 'response'}
    )
  }

  userLogout(): Observable<any>{
    const token = localStorage.getItem('token') 
    return this.http.get(this.LOGOUT, {
      headers: {Authorization: 'Token ' + token}
    })
  }

  fetchLoggedUser(): Observable<any> {
    const token = localStorage.getItem('token')
    return this.http.get(this.USER_ME, {
      headers: {Authorization: 'Token ' + token}
    })
  }

}
