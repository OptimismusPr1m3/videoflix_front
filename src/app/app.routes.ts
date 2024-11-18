import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegistrationComponent } from './authentication/registration/registration.component';
import { LandingpageComponent } from './authentication/landingpage/landingpage.component';
import { MainComponent } from './main-content/main/main.component';
import { PwResetComponent } from './authentication/pw-reset/pw-reset.component';
import { ProfileComponent } from './main-content/profile/profile.component';
import { UserSettingsComponent } from './main-content/profile/user-settings/user-settings.component';
import { FileUploadComponent } from './main-content/profile/file-upload/file-upload.component';
import { MyVideosComponent } from './main-content/profile/my-videos/my-videos.component';
import { ImprintComponent } from './foot/imprint/imprint.component';
import { PpolicyComponent } from './foot/ppolicy/ppolicy.component';

export const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'pw-reset', component: PwResetComponent },
  { path: 'main', component: MainComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'policy', component: PpolicyComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: 'user_settings',
        component: UserSettingsComponent,
      },
      {
        path: 'upload',
        component: FileUploadComponent,
      },
      {
        path: 'my_videos',
        component: MyVideosComponent,
      },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: LandingpageComponent}
];
