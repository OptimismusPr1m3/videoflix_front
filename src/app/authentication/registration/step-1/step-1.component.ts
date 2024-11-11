import {
  Component,
  output,
  ChangeDetectionStrategy,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
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

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.scss',
})
export class Step1Component {
  stepChange = output<string>();

  email = new FormControl(this.backService.signaledMail(), [
    Validators.required,
    Validators.email,
    Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
  ]);
  password = new FormControl('', [Validators.required]);
  password2 = new FormControl('', [Validators.required]);

  mailErrorMessage = signal('');
  hide = signal(true);
  hide2 = signal(true);

  constructor(public backService: BackendCommunicationService, public globals: GlobalVariablesService) {
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

  clickEvent2(event: MouseEvent) {
    this.hide2.set(!this.hide2());
    event.stopPropagation();
  }

  stepBack() {
    this.stepChange.emit('');
  }

  nextStep() {
    if (this.email.valid && this.password.valid) {
      this.globals.isProgressingData.set(true)
      this.backService.registerUser(this.email.value!, this.password.value!).subscribe({
        next: (resp) => {
          console.log('User registration succ.', resp)
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
