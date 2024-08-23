import { Injectable, signal } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  isProgressingData = signal<boolean>(false);
  accountNotExist = signal<boolean>(false);
  tryAgain = signal<boolean>(false);
  isProfileOpen = signal<boolean>(true);
  isVidOpen = signal<boolean>(false);


  constructor() { }


}
