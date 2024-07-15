import {
  Component,
  output,
  ChangeDetectionStrategy,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BackendCommunicationService } from '../../../services/backend-communication.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-step-1',
  standalone: true,
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './step-1.component.html',
  styleUrl: './step-1.component.scss',
})
export class Step1Component {
  stepChange = output<boolean>();

  email = new FormControl(this.backService.signaledMail(), [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  mailErrorMessage = signal('');
  pwErrorMessage = signal('');
  hide = signal(true);

  constructor(public backService: BackendCommunicationService){
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

  stepBack() {
    this.stepChange.emit(false);
  }

  nextStep() {}
}
