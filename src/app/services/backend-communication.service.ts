import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendCommunicationService {

  mails: any | null = []

  constructor(private http: HttpClient) { }

  getMailsWithResponse(enteredMail: string | null) {
    this.http.get('http://127.0.0.1:8000/api/users/', {observe: 'response'}).subscribe(res => {
      this.mails = res.body;
      const foundMail = this.mails.find(( mail: {email: string}) => mail.email === enteredMail);
      console.log(foundMail);
  })
}

  getMails() {
    return this.http.get('http://127.0.0.1:8000/api/users/')
  }

}
