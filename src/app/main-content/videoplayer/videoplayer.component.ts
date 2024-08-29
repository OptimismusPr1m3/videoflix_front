import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {

  @ViewChild('videoFrame') videoFrame!: ElementRef<HTMLVideoElement>
  @ViewChild('videoWrapper') videoWrapper!: ElementRef<HTMLDivElement>

  constructor(public globals: GlobalVariablesService){}

  closePlayer() {
    this.globals.isVidOpen.set(!this.globals.isVidOpen())
  }

  openFullscreen(){
    const videoWrapper = this.videoWrapper.nativeElement
    videoWrapper.requestFullscreen()
    this.prepareVideo()
  }

  prepareVideo(){
    const videoFrame = this.videoFrame.nativeElement
    videoFrame.pause()
    videoFrame.currentTime = 0
    videoFrame.play()
    videoFrame.style.height = '100%'
    videoFrame.style.width = '100%'
    videoFrame.muted = false
  } 

}
