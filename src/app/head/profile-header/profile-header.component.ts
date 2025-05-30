import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { Router, RouterLink } from '@angular/router';
import { BackendCommunicationService } from '../../services/backend-communication.service';

@Component({
    selector: 'app-profile-header',
    imports: [CommonModule, MatButtonModule, MatMenuModule, MatIconModule, RouterLink],
    templateUrl: './profile-header.component.html',
    styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {

  menuIsOpen: boolean = false;

  constructor(
    public globals: GlobalVariablesService,
    private router: Router,
    public backService: BackendCommunicationService
  ) {}

  toggleArrow() {
    this.menuIsOpen = !this.menuIsOpen;
  }

  menuOpened(isOpen: boolean) {
    this.menuIsOpen = isOpen;
  }

}
