import { Component, Renderer2 } from '@angular/core';
import { HeaderComponent } from "../../head/header/header.component";
import { LoggedHeaderComponent } from '../../head/logged-header/logged-header.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [HeaderComponent, LoggedHeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {


  constructor(private renderer: Renderer2){}

  ngOnInit() {
    this.renderer.addClass(document.body, 'logged-in')
  }

}
