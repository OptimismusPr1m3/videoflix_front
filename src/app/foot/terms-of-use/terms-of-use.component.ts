import { Component } from '@angular/core';
import { HeaderComponent } from '../../head/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-terms-of-use',
    imports: [HeaderComponent, RouterLink],
    templateUrl: './terms-of-use.component.html',
    styleUrl: './terms-of-use.component.scss'
})
export class TermsOfUseComponent {

}
