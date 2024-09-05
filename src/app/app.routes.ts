import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegistrationComponent } from './authentication/registration/registration.component';
import { LandingpageComponent } from './authentication/landingpage/landingpage.component';
import { MainComponent } from './main-content/main/main.component';
import { PwResetComponent } from './authentication/pw-reset/pw-reset.component';
import { ProfileComponent } from './main-content/profile/profile.component';

export const routes: Routes = [
    { path: '', component: LandingpageComponent},
    { path: 'login', component: LoginComponent},
    { path: 'registration', component: RegistrationComponent},
    { path: 'pw-reset', component: PwResetComponent},
    { path: 'main', component: MainComponent},
    { path: 'profile', component: ProfileComponent},
];
