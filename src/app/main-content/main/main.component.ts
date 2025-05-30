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
    imports: [
        CommonModule,
        LoggedHeaderComponent,
        SliderCompComponent,
        VideoplayerComponent,
        FooterComponent,
        PreviewCompComponent,
        MatIconModule
    ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss'
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
    if (scrollPosition > this.stickyScrollPoint) {
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  openPreviewVideo() {

    this.globals.isVidOpen.set(true);
    this.globals.currentOpenedVideo.set(this.globals.currentPreviewVideo())
    this.set480pPreviewVideoString()
  }

  set480pPreviewVideoString() {
    let videoItem = this.globals.currentPreviewVideo()
    if (videoItem?.video_file.endsWith(".mp4")) {
      console.log(videoItem.video_file)
      let updatedString = videoItem.video_file.slice(0, -4) + "_480p.mp4";
      console.log("Hier der 480p String: ", updatedString)
      this.globals.currentOpened480Video.set(updatedString)
    }
  }

}
