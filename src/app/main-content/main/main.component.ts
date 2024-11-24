import { Component, HostListener, Renderer2 } from '@angular/core';
import { HeaderComponent } from '../../head/header/header.component';
import { LoggedHeaderComponent } from '../../head/logged-header/logged-header.component';
import { SliderCompComponent } from '../slider-comp/slider-comp.component';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile/profile.component';
import { VideoplayerComponent } from '../videoplayer/videoplayer.component';
import { FileUploadComponent } from "../profile/file-upload/file-upload.component";
import { FooterComponent } from '../../foot/footer/footer.component';
import { PreviewCompComponent } from "../preview-comp/preview-comp.component";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    LoggedHeaderComponent,
    SliderCompComponent,
    VideoplayerComponent,
    FileUploadComponent,
    FooterComponent,
    PreviewCompComponent,
    MatIconModule
],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {

  stickyScrollPoint = 28
  isSticky = false
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

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollPosition = window.scrollY || window.pageYOffset;
    console.log(scrollPosition)
    if (scrollPosition > this.stickyScrollPoint) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

}
