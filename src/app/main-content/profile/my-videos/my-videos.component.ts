import { Component } from '@angular/core';
import { NgxSpinnerComponent, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-my-videos',
  standalone: true,
  imports: [NgxSpinnerModule],
  templateUrl: './my-videos.component.html',
  styleUrl: './my-videos.component.scss'
})
export class MyVideosComponent {

  constructor(public spinner: NgxSpinnerService){}


  ngOnInit(){
    //this.spinner.show()
  }

}
