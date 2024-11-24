import { ChangeDetectionStrategy, Component, Renderer2, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { HeaderComponent } from '../../head/header/header.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FooterComponent } from "../../foot/footer/footer.component";
import { ErrorToastComponent } from "../../toasts/error-toast/error-toast.component";
import { ErrorToastMobileComponent } from '../../toasts/error-toast-mobile/error-toast-mobile.component';

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
    NgxSpinnerModule,
    FooterComponent,
    ErrorToastComponent,
    ErrorToastMobileComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;

  mailErrorMessage = signal('');
  isErrorToast: boolean = false; 
  hide = signal(true);

  constructor(
    public backService: BackendCommunicationService,
    public router: Router,
    public globals: GlobalVariablesService,
    private spinner: NgxSpinnerService,
    private renderer: Renderer2
  ) {
    this.form = new FormGroup({
      email: new FormControl(this.backService.signaledMail(), [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })
  }

  closeErrorToast(wasCLicked: boolean) {
    this.globals.errorToastClass.set(wasCLicked ? 'fade-out-animation' : '');
  }

  closeMobileErrorToast(wasCLicked: boolean) {
    this.globals.mobileErrorToastClass.set(wasCLicked ? 'fade-out-mobile-animation' : '');
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'login-page');
  }

  updateMailErrorMessage() {
    if (this.form.get('email')?.hasError('required')) {
      return('Bitte gib deine E-Mail ein !');
    } else if (this.form.get('email')?.hasError('email')) {
      return('E-Mailadresse ungültig !');
    } else if (this.form.get('email')?.hasError('pattern')) {
      return('Deine Email sollte ohne Sonderzeichen sein !');
    } else {
      return('');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  tryLogin() {
    if (this.form.get('email')?.valid && this.form.get('password')?.valid) {
      this.spinner.show()
      this.backService
        .userLogin(this.form.get('email')?.value!, this.form.get('password')?.value!)
        .subscribe({
          next: (resp) => {
            console.log(resp.body.token);
            localStorage.setItem('token', resp.body.token);
          },
          error: (err) => {
            this.spinner.hide()
            this.errorHandling()
            console.error('Ging so nicht durch ', err);
          },
          complete: () => {
            this.spinner.hide()
            console.log('Jetzt fertig mit Antwort');
            this.router.navigate(['/main/']);
          },
        });
    }
  }

  testfunc() {
    
  }

  errorHandling() {
    this.globals.errorToastClass.set('fade-in-animation');
    this.globals.mobileErrorToastClass.set('fade-in-mobile-animation');
    setTimeout(() => {
      this.form.get('password')?.setValue('');
    }, 1500);
  }
}
