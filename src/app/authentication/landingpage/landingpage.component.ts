import { ChangeDetectionStrategy, Component, Renderer2, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { HeaderComponent } from '../../head/header/header.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { FooterComponent } from '../../foot/footer/footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-landingpage',
    imports: [
        CommonModule,
        MatIconModule,
        HeaderComponent,
        NgxSpinnerComponent,
        FooterComponent,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './landingpage.component.html',
    styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {
  mail = new FormControl('', [
    Validators.required,
    Validators.email,
    Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-zA-Z]{2,4}$'),
  ]);
  mailErrorMessage = signal('');
  
  constructor(
    private spinner: NgxSpinnerService,
    private backend: BackendCommunicationService,
    private router: Router,
    public globals: GlobalVariablesService
  ) {
    merge(this.mail.statusChanges, this.mail.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateMailErrorMessage());
  }

  updateMailErrorMessage() {
    if (this.mail.hasError('required')) {
      this.mailErrorMessage.set('Bitte gib deine E-Mail ein !');
    } else if (this.mail.hasError('email')) {
      this.mailErrorMessage.set('E-Mailadresse ungültig !');
    } else if (this.mail.hasError('pattern')) {
      this.mailErrorMessage.set('Deine Email sollte ohne Sonderzeichen sein !');
    } else {
      this.mailErrorMessage.set('');
    }
  }

  checkMail() {
    if (this.mail.valid) {
      this.spinner.show();
      //console.log(this.mail.value);
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
      //console.log('invalid');
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
