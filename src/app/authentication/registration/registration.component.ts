import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

  constructor(private renderer: Renderer2){}

  ngOnInit(){
    this.renderer.addClass(document.body, 'registration-page');
  }

  ngOnDestroy(){
    this.renderer.removeClass(document.body, 'registration-page');
  }

}
