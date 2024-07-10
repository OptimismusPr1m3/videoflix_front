import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BackendCommunicationService } from '../../services/backend-communication.service';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ReactiveFormsModule],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  mail = new FormControl('');

  constructor(private http: BackendCommunicationService) {
    //this.http.getMails().subscribe(data => console.log(data))
  }

  checkMail() {
    
    /*this.http.getMails().subscribe(data => {
      console.log(data)
    })*/
    if (this.mail.value) {
      console.log(this.mail.value)
      this.http.getMailsWithResponse(this.mail.value) 
    } else {
      console.log('invalid')
    }
    
  }

}
