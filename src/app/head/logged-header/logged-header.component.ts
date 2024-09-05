import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { User } from '../../models/user.class';
import { GlobalVariablesService } from '../../services/global-variables.service';

@Component({
  selector: 'app-logged-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  templateUrl: './logged-header.component.html',
  styleUrl: './logged-header.component.scss',
})
export class LoggedHeaderComponent {
  menuIsOpen: boolean = false;
  currentUser: User | any;

  constructor(
    public backService: BackendCommunicationService,
    private router: Router,
    private globals: GlobalVariablesService,
  ) {}

  ngOnInit() {
    this.getLoggedUserData();
  }

  toggleArrow() {
    this.menuIsOpen = !this.menuIsOpen;
  }

  logOut() {
    this.backService.userLogout().subscribe({
      next: (resp) => {
        console.log('Logout success !', resp);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.router.navigate(['/']);
      },
    });
  }

  getLoggedUserData() {
    this.backService.fetchLoggedUser().subscribe({
      next: (resp) => {
        //console.log(resp);
        //this.currentUser = new User(resp)
        this.globals.currentLoggedUser.set(new User(resp))
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/login/']);
      },
      complete: () => {
        console.log('Hier der User');
        console.log(this.globals.currentLoggedUser());
      },
    });
  }

  menuOpened(isOpen: boolean) {
    this.menuIsOpen = isOpen;
  }

  openProfile() {
    this.router.navigate(['/profile/'])
    //this.globals.isProfileOpen.set(!this.globals.isProfileOpen())
  }
}
