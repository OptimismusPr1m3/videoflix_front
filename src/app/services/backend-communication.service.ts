import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { ApiEndpointsService } from './api-endpoints.service';
import { GlobalVariablesService } from './global-variables.service';
import { User } from '../models/user.class';
import { FormGroup } from '@angular/forms';
import { VideoItem } from '../models/videoItem.class';
import { mergeMap, catchError, toArray } from 'rxjs/operators';
import { VideoURLInterface } from '../models/video-urlinterface';
import { NgxSpinner } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BackendCommunicationService {
  signaledMail = signal<string | null>('');

  constructor(
    private http: HttpClient,
    private router: Router,
    private endPoints: ApiEndpointsService,
    private globals: GlobalVariablesService
  ) {}

  // checkMailAndRedirect(enteredMail: string | null) {
  //   this.http
  //     .get(this.endPoints.USERS_API, { observe: 'response' })
  //     .subscribe((res) => {
  //       this.mails = res.body;
  //       const foundMail = this.mails.find(
  //         (mail: { email: string }) => mail.email === enteredMail
  //       );
  //       if (foundMail) {
  //         this.signaledMail.set(foundMail.email);
  //         this.router.navigate(['/login']);
  //       } else {
  //         this.signaledMail.set(enteredMail);
  //         console.log('Nope');
  //         this.router.navigate(['/registration']);
  //       }
  //     });
  // }

  getUsedMails(): Observable<any> {
    return this.http.get(this.endPoints.USERS_API, { observe: 'response' });
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(
      this.endPoints.RESET_PASSWORD,
      { email: email },
      { observe: 'response' }
    );
  }

  registerUser(mail: string, password: string): Observable<any> {
    return this.http.post(
      this.endPoints.REGISTER,
      { email: mail, password: password },
      { observe: 'response' }
    );
  }

  userLogin(mail: string, password: string): Observable<any> {
    return this.http.post(
      this.endPoints.LOGIN,
      { email: mail, password: password },
      { observe: 'response' }
    );
  }

  logOut() {
    this.userLogout().subscribe({
      next: (resp) => {
        console.log('Logout success !', resp);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.router.navigate(['/login']);
      },
    });
  }

  userLogout(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(this.endPoints.LOGOUT, {
      headers: { Authorization: 'Token ' + token },
    });
  }

  fetchLoggedUser(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(this.endPoints.USER_ME, {
      headers: { Authorization: 'Token ' + token },
    });
  }

  changeLoggedUserSettings(form: FormGroup): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(this.endPoints.CHANGE_USER_ME, form.value, {
      headers: { Authorization: 'Token ' + token },
      observe: 'response',
    });
  }

  addVideoURLToLoggedUser(videoURL: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.patch(
      this.endPoints.CHANGE_USER_ME,
      {
        my_videos: videoURL,
      },
      {
        headers: { Authorization: 'Token ' + token },
      }
    );
  }

  //get and save current logged user
  getLoggedUserData() {
    this.fetchLoggedUser().subscribe({
      next: (resp) => {
        //console.log(resp);
        //this.currentUser = new User(resp)
        this.globals.currentLoggedUser.set(new User(resp));
      },
      error: (err) => {
        //console.error(err);
        this.router.navigate(['/login/']);
      },
      complete: () => {
        //console.log('Hier der User');
        //console.log(this.globals.currentLoggedUser());
      },
    });
  }

  fetchVideoItems(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(this.endPoints.VIDEO_ITEMS, {
      headers: { Authorization: 'Token ' + token },
    });
  }

  fetchVideo(url:string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(url, {
      headers: { Authorization: 'Token ' + token }
    })
  }

  changeVideoInfo(form: FormGroup, url: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: 'Token ' + token };
    return this.http.patch(url, form.value, { headers, observe: 'response' });
  }

  deleteVideo(url: string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: 'Token ' + token };
    return this.http.delete(url, { headers, observe: 'response' });
  }

  fetchSingleVideoItems(urls: string[]): Observable<(VideoItem | null)[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: 'Token ' + token };

    return from(urls).pipe(
      // from always needs string[]
      mergeMap((url) =>
        this.http.get<VideoItem>(url, { headers }).pipe(
          catchError((err) => {
            console.error(`Fehler beim Laden von ${url}:`, err);
            return of(null); // gives `null` or empty object back if error occurs
          })
        )
      ),
      toArray()
    );
  }

  fetchVideosFromCurrentUserVar() {
    const myVideos: VideoURLInterface[] =
      this.globals.currentLoggedUser()?.my_videos;
    const videoURLS: string[] = myVideos.map((video) => video.URL);
    this.globals.userVideoItems.set([]);
    this.fetchSingleVideoItems(videoURLS).subscribe({
      next: (resp) => {
        resp.forEach((element) => {
          this.globals.userVideoItems().push(element!);
        });
        //console.log('Vor der Sortierung: ', this.videoItems)
        this.sortVideos('up');
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        //console.log('Nun sollten alle Videos fertig gefetcht sein !');
        //console.log('Nach der Sortierung: ', this.globals.userVideoItems());
        this.globals.myVideosIsLoading.set(false);
      },
    });
  }

  sortVideos(direction: string) {
    this.globals.userVideoItems().sort((a, b) => {
      const dateA = new Date(a.released_at);
      const dateB = new Date(b.released_at);
      if (direction === 'up') {
        return dateA.getTime() - dateB.getTime(); // aufsteigend
      } else {
        return dateB.getTime() - dateA.getTime(); // absteigend
      }
    });
  }

  uploadVideo(form: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(this.endPoints.VIDEO_ITEMS, form, {
      headers: { Authorization: 'Token ' + token },
    });
  }

  uploadTimeStamp(timeStamps: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.patch(this.endPoints.CHANGE_USER_ME, {
      video_timestamps: timeStamps,
    }, { headers: { Authorization: 'Token ' + token }});
  }
}

// changeLoggedUserSettings(form: FormGroup): Observable<any> {
//   const token = localStorage.getItem('token')
//   return this.http.post(
//     this.endPoints.CHANGE_USER_ME,
//     {
//       first_name: form.value['first_name'],
//       last_name: form.value['last_name'],
//       date_of_birth: form.value['date_of_birth'],
//       street: form.value['street'],
//       street_number: form.value['street_number'],
//       zip_code: form.value['zip_code'],
//       city: form.value['city'],
//       country: form.value['country'],
//       phone_number: form.value['phone_number']
//     },
//     { headers: {Authorization: 'Token ' + token},
//       observe: 'response'
//     }
//   )
