import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { VideoItem } from '../../../models/videoItem.class';
import { GlobalVariablesService } from '../../../services/global-variables.service';

@Component({
  selector: 'app-video-item',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './video-item.component.html',
  styleUrl: './video-item.component.scss'
})
export class VideoItemComponent {
  @Input() videoItem!: VideoItem 
  @Input() isHovered: boolean = false

  constructor(private globals: GlobalVariablesService){}

  openVideoOverlay(videoURL: string){
    //console.log(videoURL)
    this.globals.isVidOpen.set(true)
    this.globals.currentOpenedVideo.set(this.videoItem)
  }

}
