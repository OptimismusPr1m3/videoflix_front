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
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-slider-comp',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    VideoItemComponent,
    NgxSpinnerComponent,
  ],
  templateUrl: './slider-comp.component.html',
  styleUrl: './slider-comp.component.scss',
})
export class SliderCompComponent {
  @ViewChild('category1', { read: ElementRef }) category1: ElementRef | any;
  @ViewChild('category2', { read: ElementRef }) category2: ElementRef | any;
  @ViewChild('category3', { read: ElementRef }) category3: ElementRef | any;

  groupedVideosByGenre: { [key: string]: VideoItem[] } = {};

  hoveredIndex1: number = -1; //neu auf VideoFlix
  hoveredIndex2: number = -1; // Doku
  hoveredIndex3: number = -1; // Drama

  currentPosition1: number = 0; //neu auf VideoFlix
  currentPosition2: number = 0; // Doku
  currentPosition3: number = 0; // Drama

  currentIndex1: number = 0; //neu auf VideoFlix
  currentIndex2: number = 0; // Doku
  currentIndex3: number = 0; // Drama

  scrollAmount = 1700;
  activeGroup = 'group0';

  videoItems: VideoItem[] = [];
  groupedSliderVidsDocumentation: { [key: string]: VideoItem[] } = {};
  groupedSliderVidsDrama: { [key: string]: VideoItem[] } = {};
  groupedSliderVids: { [key: string]: VideoItem[] } = {};

  numberOfPacksDocumentation: string[] = [];
  numberOfPacksDrama: string[] = [];
  numberOfPacks: string[] = [];

  videoItemCardsAmount: number = 5; // amount of videocarditems in a row which should be displayed

  windowSize: number = 0;

  constructor(
    private backService: BackendCommunicationService,
    private spinner: NgxSpinnerService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizeCategory('category1', 1, 1);
    this.resizeCategory('category2', 2, 2);
    this.resizeCategory('category3', 3, 3);
    // console.log('posi 1 : ',this.currentPosition1)
    // console.log('posi 2 : ',this.currentPosition2)
  }

  resizeCategory(category: string, numbX: number, currentIndex: number) {
    //numb is the currentPosition 1 or 2
    const sliderCategory = this.getRightCategory(category);
    const itemWidth = sliderCategory.offsetWidth;
    const cIndex = this.getIndex(currentIndex);
    const cPosition = -cIndex * itemWidth; // sync position with currentslide index
    sliderCategory.style.transform = `translateX(${cPosition}px)`;
    this.setXPosition(numbX, cPosition); //sets the new x-Position for the slide comp which has been slided to right or left
  }

  setXPosition(numbX: number, newcPosition: number) {
    if (numbX == 1) {
      this.currentPosition1 = newcPosition;
    } else if (numbX == 2) {
      this.currentPosition2 = newcPosition;
    } else if (numbX == 3) {
      this.currentPosition3 = newcPosition;
    }
  }

  getIndex(cIndex: number) {
    if (cIndex == 1) {
      return this.currentIndex1;
    } else if (cIndex == 2) {
      return this.currentIndex2;
    } else {
      return this.currentIndex3;
    }
  }

  ngOnInit() {
    this.windowSize = window.innerWidth;
    console.log(this.windowSize);
    this.spinner.show();
    this.backService.fetchVideoItems().subscribe({
      next: (resp) => {
        console.log('Hier die Videos: ', resp);
        //this.groupVideoItems(resp);
        this.sortVideosByGenre(resp);
        this.groupVideoItems(resp) // Neu auf VideoFlix Slider
        this.groupVideoItemsByGenre('Drama'); // Drama-Slider
        this.groupVideoItemsByGenre('Documentation'); // Doku Slider
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      },
      complete: () => {
        console.log('hier die groupedslidervids: ', this.groupedSliderVids);
        console.log('Hier die numberofPacks: ', this.numberOfPacks);
        this.spinner.hide();
      },
    });
  }

  sortVideosByGenre(videos: VideoItem[]) {
    videos.forEach((video) => {
      if (!this.groupedVideosByGenre[video.genre]) {
        this.groupedVideosByGenre[video.genre] = [];
        console.log(
          `Hier das ${video.genre} Genre`,
          this.groupedVideosByGenre[video.genre]
        );
      }
      this.groupedVideosByGenre[video.genre].push(video);
    });
    console.log(this.groupedVideosByGenre);
  }

  groupVideoItems(resp: any) {
    let groupIndex = 0;
    let tempPack: VideoItem[] = [];
    resp.forEach((video: VideoItem, index: number) => {
      tempPack.push(new VideoItem(video));
      if (
        tempPack.length === this.videoItemCardsAmount ||
        index === resp.length - 1
      ) {
        this.groupedSliderVids[`group${groupIndex}`] = [...tempPack];
        tempPack = [];
        groupIndex++;
      }
    });
    this.numberOfPacks = Object.keys(this.groupedSliderVids);
  }

  // groupVideoItemsByGenre(genre: string) {
  //   let groupIndex = 0;
  //   let tempPack: VideoItem[] = [];
  //   const genreVideos = this.groupedVideosByGenre[genre] || [];

  //   genreVideos.forEach((video: VideoItem, index: number) => {
  //     tempPack.push(new VideoItem(video));
  //     if (tempPack.length === this.videoItemCardsAmount || index === genreVideos.length -1) {
  //       this.groupedSliderVids[`group${groupIndex}`] = [...tempPack];
  //       tempPack = [];
  //       groupIndex++;
  //     }
  //   })
  //   this.numberOfPacks = Object.keys(this.groupedSliderVids);
  // }

  groupVideoItemsByGenre(genre: string) {
    let groupIndex = 0;
    let tempPack: VideoItem[] = [];
    const genreVideos = this.groupedVideosByGenre[genre] || [];
    if (genre === 'Drama') {
      genreVideos.forEach((video: VideoItem, index: number) => {
        tempPack.push(new VideoItem(video));
        if (
          tempPack.length === this.videoItemCardsAmount ||
          index === genreVideos.length - 1
        ) {
          this.groupedSliderVidsDrama[`group${groupIndex}`] = [...tempPack];
          tempPack = [];
          groupIndex++;
        }
      });
      this.numberOfPacksDrama = Object.keys(this.groupedSliderVidsDrama);
    } else if (genre === 'Documentation') {
      genreVideos.forEach((video: VideoItem, index: number) => {
        tempPack.push(new VideoItem(video));
        if (
          tempPack.length === this.videoItemCardsAmount ||
          index === genreVideos.length - 1
        ) {
          this.groupedSliderVidsDocumentation[`group${groupIndex}`] = [...tempPack];
          tempPack = [];
          groupIndex++;
        }
      });
      this.numberOfPacksDocumentation = Object.keys(this.groupedSliderVidsDocumentation);
    }
  }

  nextVideos(direction: string, category: string, numbX: number) {
    const sliderCategory = this.getRightCategory(category);
    const itemWidth = sliderCategory.offsetWidth;
    this.setCategoryIndex(category, direction);
    const cPosition = -this.getIndex(numbX) * itemWidth; // Berechne neue Position basierend auf dem Index
    sliderCategory.style.transform = `translateX(${cPosition}px)`;
  }

  setCategoryIndex(category: string, direction: string) {
    if (category === 'category1') { // Neu auf VideoFlix 
      if (direction === '-') {
        this.currentIndex1 = Math.min(
          this.currentIndex1 + 1,
          this.numberOfPacks.length - 1
        ); // Grenze oben setzen
      } else {
        this.currentIndex1 = Math.max(this.currentIndex1 - 1, 0); // Grenze unten setzen
      }
    } else if (category === 'category2') { // 
      if (direction === '-') {
        this.currentIndex2 = Math.min(
          this.currentIndex2 + 1,
          this.numberOfPacksDocumentation.length - 1
        ); // Grenze oben setzen
      } else {
        this.currentIndex2 = Math.max(this.currentIndex2 - 1, 0); // Grenze unten setzen
      }
    } else if (category === 'category3') {
      if (direction === '-') {
        this.currentIndex3 = Math.min(
          this.currentIndex3 + 1,
          this.numberOfPacksDrama.length - 1
        ); // Grenze oben setzen
      } else {
        this.currentIndex3 = Math.max(this.currentIndex3 - 1, 0); // Grenze unten setzen
      }
    }
  }

  getRightCategory(category: string) {
    switch (category) {
      case 'category1':
        return this.category1.nativeElement;
      case 'category2':
        return this.category2.nativeElement;
      case 'category3':
        return this.category3.nativeElement;
      default:
        break;
    }
  }
}
