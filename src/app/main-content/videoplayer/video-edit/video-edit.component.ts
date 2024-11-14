import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariablesService } from '../../../services/global-variables.service';
import { BackendCommunicationService } from '../../../services/backend-communication.service';
import { VideoURLInterface } from '../../../models/video-urlinterface';
import { VideoItem } from '../../../models/videoItem.class';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-video-edit',
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './video-edit.component.html',
  styleUrl: './video-edit.component.scss',
})
export class VideoEditComponent {
  videoEditForm: FormGroup;
  videoURLS: string[] = [];
  videoItems: VideoItem[] = [];
  genres: string[] = ['Dokumentation','Drama','Action','Drohne']

  constructor(
    private editSpinner: NgxSpinnerService,
    public globals: GlobalVariablesService,
    public backEnd: BackendCommunicationService,
    public router: Router
  ) {
    this.videoEditForm = new FormGroup({
      title: new FormControl(this.globals.currentOpenedVideo()?.title, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]),
      genre: new FormControl(this.globals.currentOpenedVideo()?.genre, [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl(
        this.globals.currentOpenedVideo()?.description,
        [Validators.required]
      ),
    });
  }

  saveEditedVideo() {
    this.editSpinner.show('editSpinner');
    const url = this.globals.currentOpenedVideo()?.url;
    if (url) {
      this.backEnd.changeVideoInfo(this.videoEditForm, url).subscribe({
        next: (resp) => {
          console.log('Antowrt: ', resp),
            this.changeGlobalsCurrentVideo(this.videoEditForm);
        },
        error: (err) => {
          console.log('Error: ', err);
        },
        complete: () => {
          console.log('Jetzt fertig !'),
            setTimeout(() => {
              this.editSpinner.hide('editSpinner'),
                this.getBack(),
                this.backEnd.fetchVideosFromCurrentUserVar();
            }, 500);
        },
      });
    }
  }

  deleteCurrentVideo() {
    this.editSpinner.show('editSpinner');
    const url = this.globals.currentOpenedVideo()?.url;
    const updatedURLS = this.globals.currentLoggedUser()
      ?.my_videos.filter((video: any) => video.URL !== url);
    // console.log('Videos vor dem filtern: ', this.globals.currentLoggedUser()?.my_videos)
    // console.log('Videos nach dem Filtern: ', updatedURLS)
    this.backEnd.addVideoURLToLoggedUser(updatedURLS).subscribe({
      next: (resp) => {
        this.backEnd.getLoggedUserData();
        if (url) {
          this.deleteVidFromBE(url)
        }
      },
      error: (err) => {console.error(err)},
      complete: () => { setTimeout(() => {
        this.editSpinner.hide('editSpinner')
        this.getBack() 
        this.globals.isVidOpen.set(false)
        this.backEnd.fetchVideosFromCurrentUserVar()
      }, 1000);}
    })
  }

  deleteVidFromBE(url: string){
    this.backEnd.deleteVideo(url).subscribe({
      next: (resp) => {console.log(resp)},
      error: (err) => {console.error(err);},
      complete: () => {console.log('Video nun fertig geloescht')},
    });
  }

  deleteChosenVideoFromUser(url: any) {
    this.backEnd.addVideoURLToLoggedUser(url).subscribe({
      next: (resp) => {
        console.log(resp);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Jetzt wurde die eine Video URL vom Nutzer entfernt');
      },
    });
  }

  changeGlobalsCurrentVideo(form: FormGroup) {
    console.log(this.globals.currentOpenedVideo());
    const updatedVideo = {
      ...this.globals.currentOpenedVideo(),
      title: form.value['title'],
      genre: form.value['genre'],
      description: form.value['description'],
      released_at: this.globals.currentOpenedVideo()?.released_at || '',
      video_file: this.globals.currentOpenedVideo()?.video_file || '',
      cover_image: this.globals.currentOpenedVideo()?.cover_image || '',
      rating: this.globals.currentOpenedVideo()?.rating || 1,
      url: this.globals.currentOpenedVideo()?.url || '',
      duration: this.globals.currentOpenedVideo()?.duration || 0,
    };
    console.log(updatedVideo);
    this.globals.currentOpenedVideo.set(updatedVideo);
  }

  getBack() {
    this.globals.isMyVideoEditing.set(false);
  }
}
