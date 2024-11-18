import { CommonModule, Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input() isLoginScreen: boolean = false
  @Input() isImprint: boolean = false

  constructor(private location: Location){}

  stepBack() {
    this.location.back()
  }

}
