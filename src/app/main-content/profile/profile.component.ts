import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProfileHeaderComponent } from '../../head/profile-header/profile-header.component';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { User } from '../../models/user.class';
import { OversightComponent } from "./oversight/oversight.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    ProfileHeaderComponent,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    OversightComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {

  constructor(
    public backEnd: BackendCommunicationService,
    public globals: GlobalVariablesService,
    private renderer: Renderer2,
    private router: Router,
  ) {}

  first_name = new FormControl(
    { value: this.globals.currentLoggedUser()?.first_name, disabled: true },
    [Validators.required]
  );

  testfunc() {
    this.first_name.enable();
  }

  ngOnInit() {
    this.backEnd.getLoggedUserData()
    this.renderer.addClass(document.body, 'logged-in');
    this.checkActivePath()
    console.log(this.globals.currentLoggedUser())
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'logged-in');
  }

  checkActivePath() {
    const currentPath = this.router.url
    const lastSegment = currentPath.split('/').pop()
    if (lastSegment && lastSegment !== 'profile') {
      this.globals.activePath.set(lastSegment)
    }
      //console.log(lastSegment)
  }

  navigateTo(path: string, isPath: boolean) {
    if (isPath) {
      this.router.navigate(['/profile/' + path])
      this.globals.activePath.set(path)
    } else {
      this.router.navigate(['/profile/'])
      this.globals.activePath.set('oversight')
    }
  }

}
