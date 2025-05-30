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
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { SuccToastComponent } from '../../../toasts/succ-toast/succ-toast.component';
import { SuccToastMobileComponent } from '../../../toasts/succ-toast-mobile/succ-toast-mobile.component';

@Component({
    selector: 'app-file-upload',
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        MatInputModule,
        NgxSpinnerModule,
        MatSelectModule,
        RouterLink,
        SuccToastComponent,
        SuccToastMobileComponent,
    ],
    templateUrl: './file-upload.component.html',
    styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @ViewChild('videoInput') videoInput!: ElementRef<HTMLInputElement>;
  // @ViewChild('videoCanvas') videoCanvas!: ElementRef<HTMLCanvasElement>;
  videoForm: FormGroup;
  selectedVideoFile: File | null = null;
  currentUploadedVideoURL: any;
  selectedVideoDuration: number = 0;
  genres: string[] = ['Dokumentation', 'Drama', 'Action', 'Drohne'];

  constructor(
    public backEnd: BackendCommunicationService,
    public globals: GlobalVariablesService,
    private spinner: NgxSpinnerService
  ) {
    this.videoForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
      ]),
      genre: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      description: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
    });
  }

  closeErrorToast(wasCLicked: boolean) {
    this.globals.errorToastClass.set(wasCLicked ? 'fade-out-animation' : '');
    setTimeout(() => {
      this.globals.errorToastClass.set('');
    }, 2000);
    this.globals.mobileErrorToastClass.set('');
  }

  closeMobileErrorToast(wasCLicked: boolean) {
    this.globals.mobileErrorToastClass.set(
      wasCLicked ? 'fade-out-mobile-animation' : ''
    );
    setTimeout(() => {
      this.globals.mobileErrorToastClass.set('');
    }, 2000);
    this.globals.errorToastClass.set('');
  }

  triggerFileUpload() {
    this.videoInput.nativeElement.click();
  }

  emptyFileField() {
    this.selectedVideoFile = null;
    this.videoForm.patchValue({
      title: '',
      genre: '',
      description: '',
    });
    this.videoForm.markAsUntouched();
    this.globals.isUploadOpen.set(false);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedVideoFile = file;

    // console.log(this.selectedVideoFile?.type);
    // console.log(this.selectedVideoFile);

    if (file.type.startsWith('video')) {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(this.selectedVideoFile);
      video.currentTime = 1;
      // console.log(video.currentTime)
      // console.log(file.name)

      video.onloadeddata = () => {
        //this.captureVideoFrame(video);
        URL.revokeObjectURL(video.src);
        this.videoForm.patchValue({ duration: video.duration });
        //console.log(video.duration)
      };
    }
  }

  // captureVideoFrame(video: HTMLVideoElement) {
  //   const canvas = this.videoCanvas.nativeElement;
  //   const ctx = canvas.getContext('2d');

  //   if (ctx) {
  //     canvas.width = video.videoWidth || 720; // image width
  //     canvas.height = video.videoHeight || 426; // image height
  //     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  //     this.videoPreview = canvas.toDataURL('image/png');
  //   }
  // }

  convertIntoMB(bytes: number): number {
    return bytes / (1024 * 1024);
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
    if (this.videoForm.valid && this.selectedVideoFile) {
      const formData = new FormData();
      this.fillFormData(formData);
      // if (this.videoPreview) {
      //   const coverImageFile = this.dataURLtoFile(
      //     this.videoPreview,
      //     'cover_image.png'
      //   );
      //   //formData.append('cover_image', coverImageFile);
      // }
      this.uploadSub(formData);
    }
  }

  saveUploadedVideoURLToUser() {
    this.backEnd
      .addVideoURLToLoggedUser(
        this.addVideoToUserData(this.currentUploadedVideoURL)
      )
      .subscribe({
        next: (resp) => {
          //console.log('hier der urlvideo to user response: !!!!!: ',resp);
        },
        error: (err) => {
          console.error(err);
          this.spinner.hide();
        },
        complete: () => {
          //console.log('Nun sollte die VideoURL beim User angekommen sein !');
          this.spinner.hide();
          this.emptyFileField();
          this.globals.videoUploadText.set(this.globals.videoUploadStrings[0]);
          this.globals.errorToastClass.set('fade-in-animation');
          this.globals.mobileErrorToastClass.set('fade-in-mobile-animation');
        },
      });
  }

  addVideoToUserData(videoURL: any) {
    let currentVideos = this.globals.currentLoggedUser()?.my_videos;
    if (currentVideos === null) {
      return (currentVideos = [{ URL: videoURL }]);
    } else {
      currentVideos.push({ URL: videoURL });
      return currentVideos;
    }
  }

  fillFormData(formData: FormData) {
    formData.append('video_file', this.selectedVideoFile!);
    formData.append('title', this.videoForm.get('title')?.value);
    formData.append('genre', this.videoForm.get('genre')?.value);
    formData.append('description', this.videoForm.get('description')?.value);
    formData.append('duration', this.videoForm.get('duration')?.value);
  }

  uploadSub(formData: FormData) {
    this.spinner.show();
    this.backEnd.uploadVideo(formData).subscribe({
      next: (resp) => {
        this.currentUploadedVideoURL = resp['url'];
        this.globals.videoUploadText.set(this.globals.videoUploadStrings[1]);
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
        this.globals.videoUploadText.set(this.globals.videoUploadStrings[0]);
      },
      complete: () => {
        //console.log('Jetzt fertig');
        this.saveUploadedVideoURLToUser();
      },
    });
  }
}
