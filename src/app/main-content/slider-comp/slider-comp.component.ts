import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VideoItemComponent } from "./video-item/video-item.component";

@Component({
  selector: 'app-slider-comp',
  standalone: true,
  imports: [CommonModule, MatIconModule, VideoItemComponent],
  templateUrl: './slider-comp.component.html',
  styleUrl: './slider-comp.component.scss'
})
export class SliderCompComponent implements AfterViewInit {
  @ViewChild('category1', { read: ElementRef }) category1: ElementRef | any;

  items1 = [
    './assets/avatare/avatar1.png',
    './assets/avatare/avatar2.png',
    './assets/avatare/avatar3.png',
    './assets/avatare/avatar1.png',
    './assets/avatare/avatar2.png',
    './assets/avatare/avatar3.png',
    './assets/avatare/avatar1.png',
    './assets/avatare/avatar2.png',
    './assets/avatare/avatar3.png',
    './assets/avatare/avatar1.png',
    './assets/avatare/avatar2.png',
    './assets/avatare/avatar3.png',
  ];

  ngAfterViewInit() {}

  scrollTo(leftValue: number) {
    this.category1.nativeElement.scrollBy({ left: leftValue , behavior: 'smooth'});
  }
}
