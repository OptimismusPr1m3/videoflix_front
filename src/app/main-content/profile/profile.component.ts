import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileHeaderComponent } from "../../head/profile-header/profile-header.component";

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
    ProfileHeaderComponent
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {

  condition: boolean = false

  constructor(public globals: GlobalVariablesService, private renderer: Renderer2) {}

  first_name = new FormControl({ value: this.globals.currentLoggedUser()?.first_name, disabled: true}, [
    Validators.required,
  ])

  testfunc() {
    this.first_name.enable()
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'logged-in');
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.body, 'logged-in');
  }

}
