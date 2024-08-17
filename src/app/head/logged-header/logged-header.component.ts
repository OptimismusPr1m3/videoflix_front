import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { BackendCommunicationService } from '../../services/backend-communication.service';

@Component({
  selector: 'app-logged-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './logged-header.component.html',
  styleUrl: './logged-header.component.scss'
})
export class LoggedHeaderComponent {

  menuIsOpen: boolean = false;

  constructor(public backService: BackendCommunicationService, private router: Router){}

  ngOnInit() {
    this.backService.fetchLoggedUser().subscribe({
      next: (resp) => {
        console.log(resp)
      },
      error: (err) => {
        console.error(err)
        this.router.navigate(['/login/'])
        console.log('Jetzt muesste man den User auf Login redirecten.')
      },
      complete: () => {
        console.log('Hier der User');
      }
    })
  }

  toggleArrow() {
    this.menuIsOpen = !this.menuIsOpen
  }

  logOut() {
    this.backService.userLogout().subscribe({
      next: (resp) => {
        console.log('Logout success !', resp)
      },
      error: (err) => {
        console.error(err)
      },
      complete: () => {
        this.router.navigate(['/'])
      }
    })
  }

  menuOpened(isOpen: boolean) {
    this.menuIsOpen = isOpen;
  }
}
