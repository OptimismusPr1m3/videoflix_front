import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { merge } from 'rxjs';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { HeaderComponent } from '../../head/header/header.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    HeaderComponent,
    NgxSpinnerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = new FormControl(this.backService.signaledMail(), [
    Validators.required,
    Validators.email,
    Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
  ]);
  password = new FormControl('', [Validators.required]);

  mailErrorMessage = signal('');
  pwErrorMessage = signal('');
  hide = signal(true);

  constructor(
    public backService: BackendCommunicationService,
    public router: Router,
    public globals: GlobalVariablesService,
    private spinner: NgxSpinnerService
  ) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateMailErrorMessage());
  }

  updateMailErrorMessage() {
    if (this.email.hasError('required')) {
      this.mailErrorMessage.set('Bitte gib deine E-Mail ein !');
    } else if (this.email.hasError('email')) {
      this.mailErrorMessage.set('E-Mailadresse ungueltig !');
    } else if (this.email.hasError('pattern')) {
      this.mailErrorMessage.set('Deine Email sollte ohne Sonderzeichen sein !');
    } else {
      this.mailErrorMessage.set('');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  tryLogin() {
    this.spinner.show()
    if (this.email.valid && this.password.valid) {
      this.backService
        .userLogin(this.email.value!, this.password.value!)
        .subscribe({
          next: (resp) => {
            console.log(resp.body.token);
            localStorage.setItem('token', resp.body.token);
          },
          error: (err) => {
            this.spinner.hide()
            console.error('Ging so nicht durch ', err);
            this.errorHandling();
          },
          complete: () => {
            this.spinner.hide()
            console.log('Jetzt fertig mit Antwort');
            this.router.navigate(['/main/']);
          },
        });
    }
  }

  errorHandling() {
    this.globals.accountNotExist.set(true);
    setTimeout(() => {
      this.globals.accountNotExist.set(false);
      this.globals.tryAgain.set(true);
      this.password.setValue('');
      //this.email.setValue('')
    }, 1500);
  }
}
