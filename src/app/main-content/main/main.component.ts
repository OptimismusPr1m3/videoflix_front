import { Component, Renderer2 } from '@angular/core';
import { HeaderComponent } from '../../head/header/header.component';
import { LoggedHeaderComponent } from '../../head/logged-header/logged-header.component';
import { SliderCompComponent } from '../slider-comp/slider-comp.component';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { VideoplayerComponent } from '../videoplayer/videoplayer.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    LoggedHeaderComponent,
    SliderCompComponent,
    ProfileComponent,
    VideoplayerComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor(
    private renderer: Renderer2,
    public globals: GlobalVariablesService
  ) {}

  ngOnInit() {
    this.renderer.addClass(document.body, 'logged-in');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'logged-in');
  }
}
