import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VideoItemComponent } from './video-item/video-item.component';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { VideoItem } from '../../models/videoItem.class';

@Component({
  selector: 'app-slider-comp',
  standalone: true,
  imports: [CommonModule, MatIconModule, VideoItemComponent],
  templateUrl: './slider-comp.component.html',
  styleUrl: './slider-comp.component.scss',
})
export class SliderCompComponent {
  @ViewChild('category1', { read: ElementRef }) category1: ElementRef | any;
  @ViewChild('category2', { read: ElementRef }) category2: ElementRef | any;
  // @ViewChild('category3', { read: ElementRef }) category3: ElementRef | any;

  hoveredIndex1: number = -1;
  hoveredIndex2: number = -1;
  currentPosition1: number = 0;
  currentPosition2: number = 0;
  currentIndex1: number = 0;
  currentIndex2: number = 0;

  scrollAmount = 1700;
  activeGroup = 'group0';

  videoItems: VideoItem[] = [];
  groupedSliderVids: { [key: string]: VideoItem[] } = {};
  numberOfPacks: string[] = [];


  windowSize: number = 0;

  constructor(private backService: BackendCommunicationService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizeCategory('category1', 1, 1)
    this.resizeCategory('category2', 2, 2)
    // console.log('posi 1 : ',this.currentPosition1)
    // console.log('posi 2 : ',this.currentPosition2)
  }

  resizeCategory(category: string, numbX: number, currentIndex: number) { //numb is the currentPosition 1 or 2 
    const sliderCategory = this.getRightCategory(category);
    const itemWidth = sliderCategory.offsetWidth;
    const cIndex = this.getIndex(currentIndex)
    const cPosition = -cIndex * itemWidth; // sync position with currentslide index
    sliderCategory.style.transform = `translateX(${cPosition}px)`;
    this.setXPosition(numbX, cPosition) //sets the new x-Position for the slide comp which has been slided to right or left
  }

  setXPosition(numbX: number, newcPosition: number) {
    if (numbX == 1) {
      this.currentPosition1 = newcPosition
    } else if (numbX == 2){
      this.currentPosition2 = newcPosition
    }
  }

  getIndex(cIndex: number){
    if (cIndex == 1) {
      return this.currentIndex1
    } else {
      return this.currentIndex2
    }
  }

  ngOnInit() {
    this.windowSize = window.innerWidth
    console.log(this.windowSize)
    this.backService.fetchVideoItems().subscribe({
      next: (resp) => {
        this.groupVideoItems(resp);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log(this.groupedSliderVids), console.log(this.numberOfPacks);
      },
    });
  }

  groupVideoItems(resp: any) {
    let groupIndex = 0;
    let tempPack: VideoItem[] = [];
    resp.forEach((video: VideoItem, index: number) => {
      tempPack.push(new VideoItem(video));
      if (tempPack.length === 4 || index === resp.length - 1) {
        this.groupedSliderVids[`group${groupIndex}`] = [...tempPack];
        tempPack = [];
        groupIndex++;
      }
    });
    this.numberOfPacks = Object.keys(this.groupedSliderVids);
  }

  nextVideos(direction: string, category: string, numbX: number) {
    const sliderCategory = this.getRightCategory(category)
    const itemWidth = sliderCategory.offsetWidth
    this.setCategoryIndex(category, direction)
    const cPosition = -this.getIndex(numbX) * itemWidth; // Berechne neue Position basierend auf dem Index
    sliderCategory.style.transform = `translateX(${cPosition}px)`;
  }  

  setCategoryIndex(category: string, direction: string) {
    if (category === 'category1') {
      if (direction === '-') {
        this.currentIndex1 = Math.min(this.currentIndex1 + 1, this.numberOfPacks.length - 1); // Grenze oben setzen
      } else {
        this.currentIndex1 = Math.max(this.currentIndex1 - 1, 0); // Grenze unten setzen
      }
    } else if (category === 'category2') {
      if (direction === '-') {
        this.currentIndex2 = Math.min(this.currentIndex2 + 1, this.numberOfPacks.length - 1); // Grenze oben setzen
      } else {
        this.currentIndex2 = Math.max(this.currentIndex2 - 1, 0); // Grenze unten setzen
      }
    }
  }

  getRightCategory(category: string) {
    switch (category) {
      case 'category1':
        return this.category1.nativeElement;          
      case 'category2':
        return this.category2.nativeElement;
      default:
        break;
    }
  }
}
