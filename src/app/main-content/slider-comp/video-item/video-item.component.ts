import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-video-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-item.component.html',
  styleUrl: './video-item.component.scss'
})
export class VideoItemComponent {
  @Input() videoItem: any




}
