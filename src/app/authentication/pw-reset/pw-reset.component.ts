import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { HeaderComponent } from '../../head/header/header.component';
import { FooterComponent } from '../../foot/footer/footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-pw-reset',
    imports: [
        CommonModule,
        RouterLink,
        MatIconModule,
        ReactiveFormsModule,
        HeaderComponent,
        FooterComponent,
        MatFormFieldModule,
        FormsModule,
        MatInputModule
    ],
    templateUrl: './pw-reset.component.html',
    styleUrl: './pw-reset.component.scss'
})
export class PwResetComponent {
  mail = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
  ]);
  notFound = signal<boolean>(false);
  resetWasSent: boolean = false;

  constructor(private http: BackendCommunicationService) {}

  checkMail() {
    if (this.mail.valid) {
      this.http.resetPassword(this.mail.value!).subscribe({
        next: (resp) => {this.resetWasSent = true},
        error: (err) => {this.resetWasSent = true}});
    }
  }

  resetSignal() {
    setTimeout(() => {
      this.notFound.set(false);
    }, 2000);
  }
}
