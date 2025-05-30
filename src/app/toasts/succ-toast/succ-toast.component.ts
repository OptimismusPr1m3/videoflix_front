import { Component, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-succ-toast',
    imports: [MatIconModule],
    templateUrl: './succ-toast.component.html',
    styleUrl: './succ-toast.component.scss'
})
export class SuccToastComponent {
  
  closeError = output<boolean>();

  closeToast() {
    this.closeError.emit(true);
  }

}
