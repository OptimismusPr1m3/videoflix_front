import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-succ-toast-mobile',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './succ-toast-mobile.component.html',
  styleUrl: './succ-toast-mobile.component.scss'
})
export class SuccToastMobileComponent {
  closeError = output<boolean>();

  closeToast() {
    this.closeError.emit(true);
  }

}
