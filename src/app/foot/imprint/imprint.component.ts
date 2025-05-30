import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../head/header/header.component';

@Component({
    selector: 'app-imprint',
    imports: [CommonModule, HeaderComponent],
    templateUrl: './imprint.component.html',
    styleUrl: './imprint.component.scss'
})
export class ImprintComponent {

}
