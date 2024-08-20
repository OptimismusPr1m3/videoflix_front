import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-video-item',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './video-item.component.html',
  styleUrl: './video-item.component.scss'
})
export class VideoItemComponent {
  @Input() videoItem: string = ''
  @Input() isHovered: boolean = false



}
