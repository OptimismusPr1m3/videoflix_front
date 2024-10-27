import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.class';
import { VideoItem } from '../models/videoItem.class';


@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  isProgressingData = signal<boolean>(false);
  accountNotExist = signal<boolean>(false);
  tryAgain = signal<boolean>(false);
  isProfileOpen = signal<boolean>(false);
  isVidOpen = signal<boolean>(false);
  userVideoItems = signal<VideoItem[]>([])
  currentLoggedUser = signal<User | null>(null);

  currentOpenedVideo = signal<VideoItem | null>(null);
  currentOpened480Video = signal<string>('');

  activePath = signal<string>('oversight');
  activeHeadingString = signal<string>('Übersicht')

  isSettingsEditing = signal<boolean>(false);
  isMyVideoEditing = signal<boolean>(false);


  //For Spinners
  // my-video-spinner
  myVideosIsLoading = signal<boolean>(true)


  videoUploadStrings: string[] = ['Dein Video wird gerade hochgeladen...', 'Gleich fertig']
  videoUploadText = signal<string>(this.videoUploadStrings[0])


  constructor() { }



}
