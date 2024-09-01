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
  materialPlayButtonString: string = 'pause'
  materialVolumeButtonString: string = 'volume_up'

  muteLabel: string = 'Stumm schalten'

  standardVolume: number = 0


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
    this.restartVideo()
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

  configVolume(event: any){
    const video = this.videoFrame.nativeElement;
    video.volume = event.target.value / 100;
    //console.log(event.target.value / 100)
  }

  updateProgressBar() {
    const video = this.videoFrame.nativeElement;
    this.currentTime = video.currentTime;
  }

  initializeVideo() {
    const video = this.videoFrame.nativeElement;
    this.videoDuration = video.duration
  }

  restartVideo() {
    const videoFrame = this.videoFrame.nativeElement
    videoFrame.pause()
    videoFrame.currentTime = 0
    videoFrame.play()
  }

  toggleVideo() {
    const videoFrame = this.videoFrame.nativeElement
    if (this.isPlaying) {
      videoFrame.pause()
      this.materialPlayButtonString = 'play_arrow'
      this.isPlaying = false
    } else {
      videoFrame.play()
      this.isPlaying = true
      this.materialPlayButtonString = 'pause'
    }
  }

  skip10(direction: number) {
    const videoFrame = this.videoFrame.nativeElement
    videoFrame.currentTime += direction
  }

  toggleAudio() {
    const videoFrame = this.videoFrame.nativeElement
    if (videoFrame.muted) {
      videoFrame.muted = false
      this.materialVolumeButtonString = 'volume_up'
    } else {
      videoFrame.muted = true
      this.materialVolumeButtonString = 'volume_off'
    }
  }

}
