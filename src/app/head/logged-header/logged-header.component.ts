import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-logged-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './logged-header.component.html',
  styleUrl: './logged-header.component.scss'
})
export class LoggedHeaderComponent {

}
