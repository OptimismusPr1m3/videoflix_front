import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-preview-comp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-comp.component.html',
  styleUrl: './preview-comp.component.scss'
})
export class PreviewCompComponent {
  @ViewChild('previewFrame') previewFrame!: ElementRef<HTMLVideoElement>


  videoDuration: number = 0
  currentTime: number = 0

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      const preview = this.previewFrame.nativeElement
      preview.play()
    }, 5000);
  }

}
