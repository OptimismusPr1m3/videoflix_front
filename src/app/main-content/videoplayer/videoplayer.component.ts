import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

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

  videoDuration: number = 0
  currentTime: number = 0
  isVidFullScreen: boolean = false
  isPlaying: boolean = false
  materialButtonString: string = 'pause'

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
    this.isPlaying = true
    videoFrame.style.height = '100%'
    videoFrame.style.width = '100%'
    videoFrame.muted = false
    this.isVidFullScreen = true
    //console.log(videoFrame.duration)
  } 

  seek(event: any) {
    const video = this.videoFrame.nativeElement;
    video.currentTime = event.target.value;
  }

  updateProgressBar() {
    const video = this.videoFrame.nativeElement;
    this.currentTime = video.currentTime;
  }

  initializeVideo() {
    const video = this.videoFrame.nativeElement;
    this.videoDuration = video.duration
  }

  toggleVideo() {
    const videoFrame = this.videoFrame.nativeElement
    if (this.isPlaying) {
      videoFrame.pause()
      this.materialButtonString = 'play_arrow'
      this.isPlaying = false
    } else {
      videoFrame.play()
      this.isPlaying = true
      this.materialButtonString = 'pause'
    }
  }

}
