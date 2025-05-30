import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { VideoItem } from '../../models/videoItem.class';

@Component({
    selector: 'app-preview-comp',
    imports: [CommonModule],
    templateUrl: './preview-comp.component.html',
    styleUrl: './preview-comp.component.scss'
})
export class PreviewCompComponent {
  @ViewChild('previewFrame') previewFrame!: ElementRef<HTMLVideoElement>

  CURRENT_PREVIEW_VIDEO_URL = 'https://storage.bastian-wolff.com/api/videos/19/'

  videoDuration: number = 0
  currentTime: number = 0

  constructor(private backend: BackendCommunicationService, public globals: GlobalVariablesService) {}

  ngOnInit() {
    this.getPreviewVideo()
    setTimeout(() => {
      const preview = this.previewFrame.nativeElement
      preview.play()
    }, 5000);
  }

  getPreviewVideo() {
    this.backend.fetchVideo(this.CURRENT_PREVIEW_VIDEO_URL).subscribe({ 
      next: (resp) => {this.globals.currentPreviewVideo.set(new VideoItem(resp))}
    })
  }


}
