import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step-2',
  standalone: true,
  imports: [],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.scss'
})
export class Step2Component {

  constructor(public router: Router){}

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
