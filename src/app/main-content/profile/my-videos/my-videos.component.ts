import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariablesService } from '../../../services/global-variables.service';
import { VideoURLInterface } from '../../../models/video-urlinterface';
import { VideoItem } from '../../../models/videoItem.class';
import { BackendCommunicationService } from '../../../services/backend-communication.service';
import { User } from '../../../models/user.class';
import { VideoItemComponent } from "../../slider-comp/video-item/video-item.component";

@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, VideoItemComponent],
  templateUrl: './my-videos.component.html',
  styleUrl: './my-videos.component.scss',
})
export class MyVideosComponent {
  videoURLS: string[] = []
  videoItems: VideoItem[] = []
  hoveredIndex: number = -1;

  constructor(
    public spinner: NgxSpinnerService,
    public globals: GlobalVariablesService,
    public backEnd: BackendCommunicationService,
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.spinner.show()
    if (this.globals.currentLoggedUser()?.my_videos) {
      this.fetchVideosFromCurrentUserVar()
    } else {
      this.backEnd.fetchLoggedUser().subscribe({
        next: (resp) => {this.globals.currentLoggedUser.set(new User(resp))},
        error: (err) => {console.error(err)},
        complete: () => {this.fetchVideosFromCurrentUserVar()}
      })
    }
  }


  fetchVideosFromCurrentUserVar() {
    const myVideos: VideoURLInterface[] = this.globals.currentLoggedUser()?.my_videos;
      const videoURLS: string[] = myVideos.map(video => video.URL)
      this.videoURLS = videoURLS
      //console.log('Video URLs: ', this.videoURLS);
      this.backEnd.fetchSingleVideoItems(this.videoURLS).subscribe({
        next: (resp) => {
          resp.forEach(element => {
            this.videoItems.push(element!)
          });
          //console.log('Vor der Sortierung: ', this.videoItems)
          this.sortVideos("up")
        },
        error: (err) => {
          console.error(err)
        },
        complete: () => {
          console.log('Nun sollten alle Videos fertig gefetcht sein !')
          console.log('Nach der Sortierung: ', this.videoItems)
          this.spinner.hide()
        }
      })
  }
  
  sortVideos(direction: string){
    this.videoItems.sort((a, b) => {
      const dateA = new Date(a.released_at);
      const dateB = new Date(b.released_at);
      if (direction === "up") {
        return dateA.getTime() - dateB.getTime(); // aufsteigend
      } else {
        return dateB.getTime() - dateA.getTime(); // absteigend
      }
       
    });
  }

}
