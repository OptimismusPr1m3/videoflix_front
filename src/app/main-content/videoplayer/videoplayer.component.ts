import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  input,
  ViewChild,
} from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { MatIconModule } from '@angular/material/icon';
import { VideoEditComponent } from './video-edit/video-edit.component';
import { BackendCommunicationService } from '../../services/backend-communication.service';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, MatIconModule, VideoEditComponent],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent {
  @ViewChild('videoFrame') videoFrame!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoWrapper') videoWrapper!: ElementRef<HTMLDivElement>;
  @Input() isInMyVideos: boolean = false;

  videoDuration: number = 0;
  currentTime: number = 0;
  isVidFullScreen: boolean = false;
  isMouseInactive: boolean = false;
  mouseTimeout: any;
  isPlaying: boolean = false;
  materialPlayButtonString: string = 'pause';
  materialVolumeButtonString: string = 'volume_up';

  is480p: boolean = true;
  qualityPickerIsOpen: boolean = false;

  muteLabel: string = 'Stumm schalten';

  standardVolume: number = 100;
  volumeBarIsOpen: boolean = false;

  constructor(
    public globals: GlobalVariablesService,
    private backend: BackendCommunicationService
  ) {}

  @HostListener('mousemove')
  onMouseMove() {
    this.isMouseInactive = false;
    clearTimeout(this.mouseTimeout);
    this.mouseTimeout = setTimeout(() => {
      this.isMouseInactive = true;
    }, 2000);
  }

  ngOnInit() {
    try {
      const video = this.videoFrame.nativeElement;
      video.addEventListener('timeupdate', () => {
        this.updateProgressBar();
      });
    } catch (err) {
      console.log(err);
    }
  }

  roundNumbers(number: number) {
    return Math.round(number);
  }

  closeFullscreen() {
    this.globals.isVidOpen.set(!this.globals.isVidOpen());
    this.globals.currentWatchedVideoTimeStamp.set(this.currentTime);
    console.log(
      'Zeitstempel vom Video: ',
      this.globals.currentWatchedVideoTimeStamp()
    );
    console.log('der currentuser: ', this.globals.currentLoggedUser());
    console.log(
      'hier die akutelle videoURL: ',
      this.globals.currentOpenedVideo()?.url
    );
    this.setTimeStampsForUser();
  }

  closePlayer() {
    this.globals.isVidOpen.set(!this.globals.isVidOpen());
  }

  setTimeStampsForUser() {
    let previousStamps = this.globals.currentLoggedUser()?.video_timestamps;
    const newStamps = this.createStampsJSON(previousStamps);
    console.log('Hier die Zeitstempel vor dem hochladen: ', newStamps);
    this.backend.uploadTimeStamp(newStamps).subscribe({
      next: (resp) =>
        console.log('Zeitstempel erfolgreich aktualisiert: ', resp),
      error: (err) =>
        console.log('Fehler beim Aktualisieren der Zeitstempel:', err),
      complete: () => this.backend.getLoggedUserData(),
    });
  }

  // setting up new JSON for upload timestamps
  createStampsJSON(currentStamps: any): any {
    let previousStamps = currentStamps;
    if (previousStamps === null) {
      previousStamps = [
        {
          URL: this.globals.currentOpenedVideo()?.url,
          STAMP: this.globals.currentWatchedVideoTimeStamp(),
        },
      ];
      console.log(previousStamps);
    } else {
      const alreadyWatchedVideoIndex =
        this.findPreviousStampIndex(previousStamps);
      if (alreadyWatchedVideoIndex !== -1) {
        previousStamps[alreadyWatchedVideoIndex].STAMP =
          this.globals.currentWatchedVideoTimeStamp();
      } else {
        previousStamps.push({
          URL: this.globals.currentOpenedVideo()?.url,
          STAMP: this.globals.currentWatchedVideoTimeStamp(),
        });
      }
    }
    return previousStamps;
  }

  // get index if video was already watched but is now getting only a new timestamp
  findPreviousStampIndex(previousStamps: any) {
    return previousStamps.findIndex(
      (watchedVideo: { URL: string }) =>
        watchedVideo.URL === this.globals.currentOpenedVideo()?.url
    );
  }

  openFullscreen() {
    const videoWrapper = this.videoWrapper.nativeElement;
    videoWrapper.requestFullscreen();
    this.prepareVideo();
  }

  toggleFullscreen() {
    const videoWrapper = this.videoWrapper.nativeElement;
    if (!document.fullscreenElement) {
      videoWrapper.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  prepareVideo() {
    const videoFrame = this.videoFrame.nativeElement;
    this.restartVideo();
    this.isPlaying = true;
    videoFrame.style.height = '100%';
    videoFrame.style.width = '100%';
    videoFrame.muted = false;
    this.isVidFullScreen = true;
    //console.log(videoFrame.duration)
  }

  seek(event: any) {
    const video = this.videoFrame.nativeElement;
    console.log(event.target.value);
    video.currentTime = event.target.value / 1000;
  }

  configVolume(event: any) {
    const video = this.videoFrame.nativeElement;
    video.volume = event.target.value / 100;
    //console.log(event.target.value / 100)
  }

  updateProgressBar() {
    const video = this.videoFrame.nativeElement;
    const rangeInput = document.querySelector(
      '.progres-bar'
    ) as HTMLInputElement;

    this.currentTime = video.currentTime;
    const value = (this.currentTime / this.videoDuration) * 100; // progress in %

    rangeInput.style.setProperty('--value', value.toString());
  }

  initializeVideo() {
    const video = this.videoFrame.nativeElement;
    this.videoDuration = video.duration;
  }

  restartVideo() {
    const videoFrame = this.videoFrame.nativeElement;
    videoFrame.pause();
    this.lookForTimestamp();
    videoFrame.currentTime = this.lookForTimestamp();
    // this.globals.currentOpenedVideo()?.timestamp != null
    //   ? this.globals.currentOpenedVideo()?.timestamp
    //   : 0;
    this.isPlaying = true;
    this.materialPlayButtonString = 'pause';
    videoFrame.play();
  }

  forceRestart() {
    const videoFrame = this.videoFrame.nativeElement;
    videoFrame.pause();
    videoFrame.currentTime = 0;
    this.isPlaying = true;
    this.materialPlayButtonString = 'pause';
    videoFrame.play()
  }

  lookForTimestamp() {
    if (this.globals.currentLoggedUser()?.video_timestamps) {
      const foundTimestamp = this.globals
      .currentLoggedUser()
      ?.video_timestamps.find(
        (stamp: { URL: string | undefined }) =>
          stamp.URL === this.globals.currentOpenedVideo()?.url
      );
    //console.log(foundTimestamp);
    return foundTimestamp?.STAMP ?? 0;
    } else {
      return 0
    }
  }

  toggleVideo() {
    const videoFrame = this.videoFrame.nativeElement;
    if (this.isPlaying) {
      videoFrame.pause();
      this.materialPlayButtonString = 'play_arrow';
      this.isPlaying = false;
    } else {
      videoFrame.play();
      this.isPlaying = true;
      this.materialPlayButtonString = 'pause';
    }
  }

  skip10(direction: number) {
    const videoFrame = this.videoFrame.nativeElement;
    videoFrame.currentTime += direction; 
  }

  toggleAudio() {
    const videoFrame = this.videoFrame.nativeElement;
    this.standardVolume = videoFrame.volume * 100;
    this.volumeBarIsOpen = !this.volumeBarIsOpen;
  }

  toggleQualiPicker() {
    this.qualityPickerIsOpen = !this.qualityPickerIsOpen;
  }

  openVideoEdit() {
    console.log(this.globals.currentOpenedVideo()?.url);
    this.globals.isMyVideoEditing.set(true);
  }

  setVideoQualitySource(quality: string) {
    const videoFrame = this.videoFrame.nativeElement;
    videoFrame.pause();
    const currentTime = videoFrame.currentTime;
    this.is480p = quality === '480' ? true : false;
    videoFrame.load();
    videoFrame.currentTime = currentTime;
    videoFrame.play();
    this.isPlaying = true;
    this.materialPlayButtonString = 'pause';
    this.qualityPickerIsOpen = false;
  }

  formatVideoDuration(durationInSeconds: number): string {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${formattedSeconds}`;
  }
}
