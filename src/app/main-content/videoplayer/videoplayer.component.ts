import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, input, ViewChild } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { VideoEditComponent } from "./video-edit/video-edit.component";

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, MatIconModule, VideoEditComponent],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {

  @ViewChild('videoFrame') videoFrame!: ElementRef<HTMLVideoElement>
  @ViewChild('videoWrapper') videoWrapper!: ElementRef<HTMLDivElement>
  @Input() isInMyVideos: boolean = false;

  videoDuration: number = 0
  currentTime: number = 0
  isVidFullScreen: boolean = false
  isPlaying: boolean = false
  materialPlayButtonString: string = 'pause'
  materialVolumeButtonString: string = 'volume_up'

  is480p: boolean = true
  qualityPickerIsOpen: boolean = false

  muteLabel: string = 'Stumm schalten'

  standardVolume: number = 100
  volumeBarIsOpen: boolean = false


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
    this.standardVolume = videoFrame.volume * 100
    this.volumeBarIsOpen = !this.volumeBarIsOpen
  }

  toggleQualiPicker() {
    this.qualityPickerIsOpen = !this.qualityPickerIsOpen
  }

  openVideoEdit() {
    console.log(this.globals.currentOpenedVideo()?.url)
    this.globals.isMyVideoEditing.set(true)
  }

  setVideoQualitySource(quality: string) {
    const videoFrame = this.videoFrame.nativeElement
    videoFrame.pause()
    const currentTime = videoFrame.currentTime
    this.is480p = quality === '480' ? true : false
    videoFrame.load()
    videoFrame.currentTime = currentTime
    videoFrame.play()
    this.qualityPickerIsOpen = false
  }

}
