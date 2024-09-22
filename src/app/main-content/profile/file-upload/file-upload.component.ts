import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BackendCommunicationService } from '../../../services/backend-communication.service';
import { GlobalVariablesService } from '../../../services/global-variables.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {

  @ViewChild('videoInput') videoInput!: ElementRef<HTMLInputElement>; 
  @ViewChild('videoCanvas') videoCanvas!: ElementRef<HTMLCanvasElement>;
  videoForm: FormGroup;
  selectedVideoFile: File | null = null
  videoPreview: any
  currentUploadedVideoURL: any

  constructor(public backEnd: BackendCommunicationService, private globals: GlobalVariablesService) {
    this.videoForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      genre: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl('Penis',[Validators.required])
    });
  }

  triggerFileUpload() {
    this.videoInput.nativeElement.click()
  }

  onFileSelected(event: any){
    const file: File = event.target.files[0];
    this.selectedVideoFile = file;

    console.log(this.selectedVideoFile?.type)
    console.log(this.selectedVideoFile)

    if (file.type.startsWith('video')) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(this.selectedVideoFile)
      video.currentTime = 1

      video.onloadeddata = () => {
        this.captureVideoFrame(video);
        URL.revokeObjectURL(video.src)
      };
    } else {
      this.videoPreview = null
    }
  }

  captureVideoFrame(video: HTMLVideoElement) {
    const canvas = this.videoCanvas.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = 150;
      canvas.height = 100;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      this.videoPreview = canvas.toDataURL('image/png')
    }
  }

  
  convertIntoMB(bytes: number): number {

    return bytes / (1024 * 1024)
  }

  dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
  }



  saveVideo() {

    const formData = new FormData();
    this.fillFormData(formData)
    if (this.videoPreview) {
      const coverImageFile = this.dataURLtoFile(this.videoPreview, 'cover_image.png')
      formData.append('cover_image', coverImageFile)
    }
    this.uploadSub(formData);
  }

  saveUploadedVideoURLToUser() {
    //console.log(this.globals.currentLoggedUser()?.my_videos[0])
    this.backEnd.addVideoURLToLoggedUser(this.addVideoToUserData(this.currentUploadedVideoURL)).subscribe({
      next: (resp) => {
        console.log(resp)
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
        console.log('Nun sollte die VideoURL beim User angekommen sein !')
      }
    })
  }

  addVideoToUserData(videoURL: any){
    let currentVideos = this.globals.currentLoggedUser()?.my_videos
    if (currentVideos === null) {
      console.log('jop')
      console.log(currentVideos)
      return currentVideos = [{ URL: videoURL }]
    }else {
      console.log('schon was drinnen !')
      console.log(currentVideos)
      currentVideos.push( {URL: videoURL} )
      return currentVideos
    }
  }

  fillFormData(formData: FormData) {
    formData.append('video_file', this.selectedVideoFile!);
    formData.append('title', this.videoForm.get('title')?.value);
    formData.append('genre', this.videoForm.get('genre')?.value);
    formData.append('description', this.videoForm.get('description')?.value);
  }

  uploadSub(formData: FormData) {
    this.backEnd.uploadVideo(formData).subscribe({
      next: (resp) => {
        //console.log(resp)
        //console.log(resp['url'])
        this.currentUploadedVideoURL = resp['url']
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
        console.log('Jetzt fertig')
        this.saveUploadedVideoURLToUser()
      }
    })
  }

}
