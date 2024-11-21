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
    public globals: GlobalVariablesService,
  ) {}

  ngOnInit() {
    this.backService.getLoggedUserData();
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

  openUploadVideoComp() {
    this.globals.isUploadOpen.set(!this.globals.isUploadOpen())
  }

  menuOpened(isOpen: boolean) {
    this.menuIsOpen = isOpen;
  }

  openLink(url: string) {
    this.router.navigate([url])
  }

}
