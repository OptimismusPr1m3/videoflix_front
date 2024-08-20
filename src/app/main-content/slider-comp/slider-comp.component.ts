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

  hoveredIndex1: number = -1
  hoveredIndex2: number = -1
  hoveredIndex3: number = -1

  items1 = [
    './assets/img/pic0.jpg',
    './assets/img/pic1.jpg',
    './assets/img/pic2.jpg',
    './assets/img/pic3.jpg',
    './assets/img/pic0.jpg',
    './assets/img/pic1.jpg',
    './assets/img/pic2.jpg',
    './assets/img/pic3.jpg',
    './assets/img/pic0.jpg',
    './assets/img/pic1.jpg',
    './assets/img/pic2.jpg',
    './assets/img/pic3.jpg',
  ];
  items2 = [
    './assets/img/pic0.jpg',
    './assets/img/pic1.jpg',
    './assets/img/pic2.jpg',
    './assets/img/pic3.jpg',
    './assets/img/pic0.jpg',
    './assets/img/pic1.jpg',
    './assets/img/pic2.jpg',
    './assets/img/pic3.jpg',
    './assets/img/pic0.jpg',
    './assets/img/pic1.jpg',
    './assets/img/pic2.jpg',
    './assets/img/pic3.jpg',
  ];
  items3 = [
    './assets/img/pic0.jpg',
    './assets/img/pic1.jpg',
    './assets/img/pic2.jpg',
    './assets/img/pic3.jpg',
    './assets/img/pic0.jpg',
    './assets/img/pic1.jpg',
    './assets/img/pic2.jpg',
    './assets/img/pic3.jpg',
    './assets/img/pic0.jpg',
    './assets/img/pic1.jpg',
    './assets/img/pic2.jpg',
    './assets/img/pic3.jpg',
  ];

  ngAfterViewInit() {}

  scrollTo(leftValue: number) {
    this.category1.nativeElement.scrollBy({ left: leftValue , behavior: 'smooth'});
  }

  

}
