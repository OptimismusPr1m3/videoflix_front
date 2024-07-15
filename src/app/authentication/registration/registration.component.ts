import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Step1Component } from "./step-1/step-1.component";
import { Step2Component } from './step-2/step-2.component';
import { Step0Component } from "./step-0/step-0.component";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, Step1Component, Step1Component, Step2Component, Step0Component],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  isStep1: boolean = false;
  isStep2: boolean = false;

  constructor(private renderer: Renderer2){}

  ngOnInit(){
    this.renderer.addClass(document.body, 'registration-page');
  }

  ngOnDestroy(){
    this.renderer.removeClass(document.body, 'registration-page');
  }

  changeStep(event: boolean) {
    this.isStep1 = event;
  }

}
