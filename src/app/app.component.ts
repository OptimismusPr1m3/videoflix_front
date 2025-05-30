import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackgroundObservationService } from './services/background-observation.service';
import { FooterComponent } from './foot/footer/footer.component';
import { GlobalVariablesService } from './services/global-variables.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'videoflix_frontend';
  
  constructor(private backgroundService: BackgroundObservationService, public globals: GlobalVariablesService){}

}
