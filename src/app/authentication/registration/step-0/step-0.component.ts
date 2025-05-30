import { Component, output } from '@angular/core';

@Component({
    selector: 'app-step-0',
    imports: [],
    templateUrl: './step-0.component.html',
    styleUrl: './step-0.component.scss'
})
export class Step0Component {

  stepChange = output<string>();

  nextStep() {
    this.stepChange.emit('step1');
  }

}
