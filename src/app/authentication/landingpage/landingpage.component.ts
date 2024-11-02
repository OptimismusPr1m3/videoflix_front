import { Component, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { HeaderComponent } from '../../head/header/header.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariablesService } from '../../services/global-variables.service';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    ReactiveFormsModule,
    HeaderComponent,
    NgxSpinnerComponent,
  ],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
})
export class LandingpageComponent {
  mail = new FormControl('');

  constructor(
    private spinner: NgxSpinnerService,
    private backend: BackendCommunicationService,
    private router: Router,
    public globals: GlobalVariablesService
  ) {}

  checkMail() {
    if (this.mail.valid) {
      this.spinner.show();
      console.log(this.mail.value);
      this.backend.getUsedMails().subscribe({
        next: (resp) => {
          this.compareKnownMailsWithEntered(resp);
        },
        error: (err) => {
          console.error(err);
          this.spinner.hide();
        },
      });
    } else {
      console.log('invalid');
    }
  }

  compareKnownMailsWithEntered(resp: any) {
    const mails = resp.body;
    const foundMail = mails.find(
      (mail: { email: string }) => mail.email === this.mail.value
    );
    if (foundMail) {
      this.backend.signaledMail.set(foundMail.email);
      this.router.navigate(['/login']);
      this.spinner.hide();
    } else {
      this.backend.signaledMail.set(this.mail.value);
      this.router.navigate(['/registration']);
      this.spinner.hide();
    }
  }
}
