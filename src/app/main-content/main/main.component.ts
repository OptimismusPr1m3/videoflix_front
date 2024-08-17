import { Component, Renderer2 } from '@angular/core';
import { HeaderComponent } from "../../head/header/header.component";
import { LoggedHeaderComponent } from '../../head/logged-header/logged-header.component';
import { SliderCompComponent } from "../slider-comp/slider-comp.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, LoggedHeaderComponent, SliderCompComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {


  constructor(private renderer: Renderer2){}

  ngOnInit() {
    this.renderer.addClass(document.body, 'logged-in')
  }

  ngOnDestroy(){
    this.renderer.removeClass(document.body, 'logged-in');
  }

}
