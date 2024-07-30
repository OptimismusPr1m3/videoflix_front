import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BackendCommunicationService } from '../../services/backend-communication.service';

@Component({
  selector: 'app-pw-reset',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, ReactiveFormsModule],
  templateUrl: './pw-reset.component.html',
  styleUrl: './pw-reset.component.scss',
})
export class PwResetComponent {
  mail = new FormControl('');

  constructor(private http: BackendCommunicationService) {}

  checkMail() {
    this.http.resetPassword(this.mail.value!).subscribe({
      next: (resp) => {
        console.log('Email gefunden', resp)
      },
      error: (err) => {
        console.log('email nicht gefunden', err)
      },
      complete: () => {
        console.log('fertig')
      },
    });
  }
}
