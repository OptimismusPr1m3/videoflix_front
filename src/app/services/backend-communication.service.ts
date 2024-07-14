import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendCommunicationService {

  mails: any | null = []
  signaledMail = signal<string | null>('');


  constructor(private http: HttpClient, private router: Router) { }

  checkMailAndRedirect(enteredMail: string | null) {
    this.http.get('http://127.0.0.1:8000/api/users/', {observe: 'response'}).subscribe(res => {
      this.mails = res.body;
      const foundMail = this.mails.find(( mail: {email: string}) => mail.email === enteredMail);
      if (foundMail) {
        this.signaledMail.set(foundMail.email);
        this.router.navigate(['/login'])
      } else {
        this.signaledMail.set(enteredMail);
        console.log("Nope")
        this.router.navigate(['/registration'])
      }
  })
}

  

}
