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

  currentLoggedUser = signal<User | null>(null);
  currentOpenedVideo = signal<VideoItem | null>(null);

  activePath = signal<string>('oversight');

  isSettingsEditing = signal<boolean>(false);


  constructor() { }


}
