import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.class';
import { VideoItem } from '../models/videoItem.class';


@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  //Registration
  isProgressingData = signal<boolean>(false);
  accountNotExist = signal<boolean>(false);
  errorToastClass = signal<string>('');
  mobileErrorToastClass = signal<string>('');
  //Login
  tryAgain = signal<boolean>(false);
  isProfileOpen = signal<boolean>(false);
  
  isVidOpen = signal<boolean>(false);
  userVideoItems = signal<VideoItem[]>([])
  //the user which is logged in
  currentLoggedUser = signal<User | null>(null);
  // response from all videos @ slider-comp
  currentVideoResponse = signal<VideoItem[] | null>([])

  //for video sources -> urls for different qualities
  currentOpenedVideo = signal<VideoItem | null>(null);
  currentOpened480Video = signal<string>('');

  //Profil Section with its Paths
  activePath = signal<string>('oversight');
  activeHeadingString = signal<string>('Übersicht')

  //Video Editing
  isSettingsEditing = signal<boolean>(false);
  isMyVideoEditing = signal<boolean>(false);

  //Upload Overlay at Main
  isUploadOpen = signal<boolean>(false);

  // variable for video_timestamps
  currentWatchedVideoTimeStamp = signal<Number | null>(null)

  //For Spinners
  // my-video-spinner
  myVideosIsLoading = signal<boolean>(true)

  videoUploadStrings: string[] = ['Dein Video wird gerade hochgeladen...', 'Gleich fertig']
  videoUploadText = signal<string>(this.videoUploadStrings[0])

  //footer at main
  isMainSiteActive = signal<boolean>(false)

  constructor() { }



}
