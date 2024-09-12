import { CommonModule } from '@angular/common';
import { Component, computed, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GlobalVariablesService } from '../../../services/global-variables.service';
import { BackendCommunicationService } from '../../../services/backend-communication.service';
import { User } from '../../../models/user.class';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {

  currentUserData: User | any
  userForm: FormGroup;

  constructor(public globals: GlobalVariablesService, public backService: BackendCommunicationService) {
    this.userForm = new FormGroup({
      first_name: new FormControl(this.globals.currentLoggedUser()?.first_name, [Validators.required, Validators.minLength(2)]),
      last_name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      date_of_birth: new FormControl('', [Validators.required]),
      entry_date: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirm_password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit(): void {
    if (this.globals.currentLoggedUser()?.first_name === undefined) {
      this.setUserSettingsInputs()
    } 
  }

  setUserSettingsInputs(): void {
    this.backService.fetchLoggedUser().subscribe({
      next: (resp) => {
        this.currentUserData = new User(resp)
        this.userForm.patchValue({
          first_name: this.currentUserData.first_name,
          last_name: this.currentUserData.last_name,
          email: this.currentUserData.email,
          date_of_birth: this.currentUserData.date_of_birth,
          entry_date: this.currentUserData.email,
        })
      }
    })
  }

  saveSettings() {
    
  }

}
