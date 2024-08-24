import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.class';


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


  constructor() { }


}
