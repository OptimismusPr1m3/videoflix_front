import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegistrationComponent } from './authentication/registration/registration.component';
import { LandingpageComponent } from './authentication/landingpage/landingpage.component';

export const routes: Routes = [
    { path: '', component: LandingpageComponent},
    { path: 'login', component: LoginComponent},
    { path: 'registration', component: RegistrationComponent},
];
