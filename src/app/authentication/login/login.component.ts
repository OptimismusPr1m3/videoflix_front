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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = new FormControl(this.backService.signaledMail(), [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  mailErrorMessage = signal('');
  pwErrorMessage = signal('');
  hide = signal(true);

  constructor(public backService: BackendCommunicationService) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateMailErrorMessage());
  }

  updateMailErrorMessage() {
    if (this.email.hasError('required')) {
      this.mailErrorMessage.set('Bitte gib deine E-Mail ein !');
    } else if (this.email.hasError('email')) {
      this.mailErrorMessage.set('E-Mailadresse ungueltig !');
    } else {
      this.mailErrorMessage.set('Bist du dumm ?');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  tryLogin() {
    console.log("hello guennni !!!!!")
  }


}
