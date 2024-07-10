import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackendCommunicationService {

  constructor(private http: HttpClient) { }

  getMails() {
    return this.http.get('http://127.0.0.1:8000/api/users/')
  }
}
