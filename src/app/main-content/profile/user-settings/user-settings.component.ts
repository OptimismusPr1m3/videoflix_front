import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GlobalVariablesService } from '../../../services/global-variables.service';
import { BackendCommunicationService } from '../../../services/backend-communication.service';
import { User } from '../../../models/user.class';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
    selector: 'app-user-settings',
    providers: [provideNativeDateAdapter()],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatDatepickerModule,
        NgxSpinnerModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './user-settings.component.html',
    styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent {
  currentUserData: User | any;
  userForm: FormGroup;

  constructor(
    public globals: GlobalVariablesService,
    public backService: BackendCommunicationService,
    private spinner: NgxSpinnerService
  ) {
    this.userForm = new FormGroup({
      first_name: new FormControl(
        this.globals.currentLoggedUser()?.first_name,
        []
      ),
      last_name: new FormControl(this.globals.currentLoggedUser()?.last_name, [
      ]),
      email: new FormControl(this.globals.currentLoggedUser()?.email, [
      ]),
      date_of_birth: new FormControl(
        this.globals.currentLoggedUser()?.date_of_birth,
        []
      ),
      date_joined: new FormControl(
        this.globals.currentLoggedUser()?.date_joined,
        [Validators.required]
      ),
      street: new FormControl(this.globals.currentLoggedUser()?.street, [
        
      ]),
      street_number: new FormControl(
        this.globals.currentLoggedUser()?.street_number,
        []
      ),
      zip_code: new FormControl(this.globals.currentLoggedUser()?.zip_code, [
        
      ]),
      city: new FormControl(this.globals.currentLoggedUser()?.city, [
        
      ]),
      country: new FormControl(this.globals.currentLoggedUser()?.country, [
        
      ]),
      phone_number: new FormControl(
        this.globals.currentLoggedUser()?.phone_number,
        []
      ),
    });
  }

  ngOnInit(): void {
    if (this.globals.currentLoggedUser()?.last_name === undefined) {
      this.setUserSettingsInputs();
    }
    this.userForm.get('date_of_birth')?.valueChanges.subscribe((date: Date) => {
      if (this.isValidDate(date)) {
        this.userForm
          .get('date_of_birth')
          ?.setValue(this.formatDateToYYYYMMDD(date), { emitEvent: false });
      }
    });
  }

  setUserSettingsInputs(): void {
    this.backService.fetchLoggedUser().subscribe({
      next: (resp) => {
        this.currentUserData = new User(resp);
        this.userForm.patchValue({
          first_name: this.currentUserData.first_name,
          last_name: this.currentUserData.last_name,
          email: this.currentUserData.email,
          date_of_birth: this.currentUserData.date_of_birth,
          date_joined: this.currentUserData.date_joined,
          street: this.currentUserData.street,
          street_number: this.currentUserData.street_number,
          zip_code: this.currentUserData.zip_code,
          city: this.currentUserData.city,
          country: this.currentUserData.country,
          phone_number: this.currentUserData.phone_number,
        });
      },
    });
  }

  saveSettings() {
    this.spinner.show()
    //console.log(this.userForm.value['date_of_birth']);
    this.backService.changeLoggedUserSettings(this.userForm).subscribe({
      next: (resp) => {
        //console.log('Das ist passiert', resp);
      },
      error: (err) => {
        console.log('Fehlgeschalgen: ', err);
      },
      complete: () => {
        //console.log('Jetzt ist es fertig');
        this.backService.getLoggedUserData()
        this.globals.isSettingsEditing.set(false)
        this.spinner.hide()
      },
    });
  }

  setUserEditing() {
    this.globals.isSettingsEditing.set(!this.globals.isSettingsEditing()) 
  }

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind nullbasiert
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isValidDate(date: any): date is Date {
    return date instanceof Date && !isNaN(date.getTime());
  }
}
