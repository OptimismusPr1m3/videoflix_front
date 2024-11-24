import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-toast-mobile',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './error-toast-mobile.component.html',
  styleUrl: './error-toast-mobile.component.scss'
})
export class ErrorToastMobileComponent {
  closeError = output<boolean>();
  errorTxt = input<string>('Error, Error, Error');
  
  closeToast() {
    this.closeError.emit(true);
  }
}
