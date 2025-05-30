import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { VideoItem } from '../../../models/videoItem.class';
import { GlobalVariablesService } from '../../../services/global-variables.service';

@Component({
    selector: 'app-video-item',
    imports: [CommonModule, NgOptimizedImage],
    templateUrl: './video-item.component.html',
    styleUrl: './video-item.component.scss'
})
export class VideoItemComponent {
  @Input() videoItem!: VideoItem;
  @Input() isHovered: boolean = false;
  @Input() isVideosWatched:boolean = false;

  constructor(private globals: GlobalVariablesService) {}

  openVideoOverlay() {
    this.globals.isVidOpen.set(true);
    this.globals.currentOpenedVideo.set(this.videoItem);
    this.set480pVideoString()
  }

  set480pVideoString() {
    if (this.videoItem.video_file.endsWith(".mp4")) {
      //console.log(this.videoItem.video_file)
      let updatedString = this.videoItem.video_file.slice(0, -4) + "_480p.mp4";
      //console.log("Hier der 480p String: ", updatedString)
      this.globals.currentOpened480Video.set(updatedString)
    }
  }

  formatVideoDuration(durationInSeconds: number): string {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
  
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  
    return `${minutes}:${formattedSeconds}`;
  }

  roundedTime(time: number): number{
    return Math.floor(time) 
  }

  completenessState():boolean {
    return this.roundedTime(this.videoItem.duration) === this.roundedTime(this.videoItem.timestamp)
  }

}
