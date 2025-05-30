import {
  Component,
  output,
  ChangeDetectionStrategy,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BackendCommunicationService } from '../../../services/backend-communication.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { GlobalVariablesService } from '../../../services/global-variables.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-step-1',
    imports: [
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './step-1.component.html',
    styleUrl: './step-1.component.scss'
})
export class Step1Component {
  stepChange = output<string>();
  form: FormGroup;
  hide = signal(true);
  hide2 = signal(true);

  constructor(public backService: BackendCommunicationService, public globals: GlobalVariablesService) {
    this.form = new FormGroup({
      email: new FormControl(this.backService.signaledMail(), [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      ]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(8)]),
    }, { validators: this.passwordsMatchValidator });

  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('password2')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  };

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

  clickEvent2(event: MouseEvent) {
    this.hide2.set(!this.hide2());
    event.stopPropagation();
  }

  stepBack() {
    this.stepChange.emit('');
  }

  nextStep() {
    if (this.form.get('email')?.valid &&
      this.form.get('password')?.valid &&
      this.form.get('password2')?.valid &&
      this.form.get('password')?.value === this.form.get('password2')?.value
    ) {
      this.globals.isProgressingData.set(true)
      this.backService.registerUser(this.form.get('email')?.value!, this.form.get('password')?.value!).subscribe({
        next: (resp) => {
          //console.log('User registration succ.', resp)
        },
        error: (err) => {
          console.error('Error registering', err)
          this.globals.isProgressingData.set(false)
        },
        complete: () => {
          this.stepChange.emit('step2')
          this.globals.isProgressingData.set(false)
        }  
    })
    }
  }
}
