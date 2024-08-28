import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.scss'
})
export class VideoplayerComponent {
  constructor(public globals: GlobalVariablesService){}

  closePlayer() {
    this.globals.isVidOpen.set(!this.globals.isVidOpen())
  }

}
