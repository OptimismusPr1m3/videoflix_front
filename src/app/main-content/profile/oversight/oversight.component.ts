import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GlobalVariablesService } from '../../../services/global-variables.service';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-oversight',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './oversight.component.html',
  styleUrl: './oversight.component.scss'
})
export class OversightComponent {
  
  constructor(public globals: GlobalVariablesService, private router: Router){}

  fastLinkTo(path: string){
    this.globals.activePath.set(path)
    this.router.navigate(['/profile/' + path])
  }

}
