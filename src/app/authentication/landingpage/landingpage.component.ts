import { Component, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { HeaderComponent } from '../../head/header/header.component';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {

  mail = new FormControl('');

  constructor(private http: BackendCommunicationService, private renderer: Renderer2) {}

  checkMail() {
    if (this.mail.valid) {
      console.log(this.mail.value)
      this.http.checkMailAndRedirect(this.mail.value)
    } else {
      console.log('invalid')
    }
  }

}
