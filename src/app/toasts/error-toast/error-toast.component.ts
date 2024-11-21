import { Component, input, Input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-toast',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss'
})
export class ErrorToastComponent {
  closeError = output<boolean>();
  errorTxt = input<string>('Error, Error, Error');

  closeToast() {
    this.closeError.emit(true);
  }

}
