import { CommonModule } from '@angular/common';
import { Component, Renderer2, Signal, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Step1Component } from "./step-1/step-1.component";
import { Step2Component } from './step-2/step-2.component';
import { Step0Component } from "./step-0/step-0.component";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { FooterComponent } from '../../foot/footer/footer.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, Step1Component, Step1Component, Step2Component, Step0Component, MatProgressSpinnerModule, FooterComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  isStep1: boolean = false;
  isStep2: boolean = false;
  isProgressing: Signal<any> | any
  

  constructor(private renderer: Renderer2, public globals: GlobalVariablesService){}

  ngOnInit(){
    this.isProgressing = this.globals.isProgressingData()
  }

  ngOnDestroy(){
    this.renderer.removeClass(document.body, 'registration-page');
  }

  changeStep(event: string) {
    if (event === 'step1') {
      this.isStep1 = true;
      this.isStep2 = false;
    } else if (event === 'step2') {
      this.isStep2 = true;
      this.isStep1 = false;
    } else {
      this.isStep1 = false;
      this.isStep2 = false;
    }

  }

}
