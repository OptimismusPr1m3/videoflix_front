import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiEndpointsService } from './api-endpoints.service';
import { GlobalVariablesService } from './global-variables.service';
import { User } from '../models/user.class';

@Injectable({
  providedIn: 'root',
})
export class BackendCommunicationService {
  mails: any | null = [];
  signaledMail = signal<string | null>('');

  constructor(private http: HttpClient, private router: Router, private endPoints: ApiEndpointsService, private globals: GlobalVariablesService) {}

  checkMailAndRedirect(enteredMail: string | null) {
    this.http.get(this.endPoints.USERS_API, { observe: 'response' }).subscribe((res) => {
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
      this.endPoints.RESET_PASSWORD,
      { email: email},
      { observe: 'response'}
    );
  }

  registerUser(mail: string, password: string): Observable<any> {
    return this.http.post(
      this.endPoints.REGISTER,
      { email: mail, password: password },
      { observe: 'response' }
    );
  }

  userLogin(mail: string, password:string): Observable<any> {
    return this.http.post(
      this.endPoints.LOGIN,
      {email: mail, password: password},
      { observe: 'response'}
    )
  }

  userLogout(): Observable<any>{
    const token = localStorage.getItem('token') 
    return this.http.get(this.endPoints.LOGOUT, {
      headers: {Authorization: 'Token ' + token}
    })
  }

  fetchLoggedUser(): Observable<any> {
    const token = localStorage.getItem('token')
    return this.http.get(this.endPoints.USER_ME, {
      headers: {Authorization: 'Token ' + token}
    })
  }
 //get and save current logged user
  getLoggedUserData() {
    this.fetchLoggedUser().subscribe({
      next: (resp) => {
        console.log(resp);
        //this.currentUser = new User(resp)
        this.globals.currentLoggedUser.set(new User(resp))
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/login/']);
      },
      complete: () => {
        console.log('Hier der User');
        console.log(this.globals.currentLoggedUser());
      },
    });
  }

  fetchVideoItems(): Observable<any> {
    const token = localStorage.getItem('token')
    return this.http.get(this.endPoints.VIDEO_ITEMS, {
      headers: {Authorization: 'Token ' + token}
    })
  }

}
