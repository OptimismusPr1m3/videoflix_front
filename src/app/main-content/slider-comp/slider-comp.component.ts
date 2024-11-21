import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VideoItemComponent } from './video-item/video-item.component';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { VideoItem } from '../../models/videoItem.class';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { User } from '../../models/user.class';

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
  @ViewChild('category4', { read: ElementRef }) category4: ElementRef | any;

  groupedVideosByGenre: { [key: string]: VideoItem[] } = {};

  hoveredIndex1: number = -1; //neu auf VideoFlix
  hoveredIndex2: number = -1; // Doku
  hoveredIndex3: number = -1; // Drama
  hoveredIndex4: number = -1; // Drama

  currentPosition1: number = 0; //neu auf VideoFlix
  currentPosition2: number = 0; // Doku
  currentPosition3: number = 0; // Drama
  currentPosition4: number = 0; // Drama

  currentIndex1: number = 0; //neu auf VideoFlix
  currentIndex2: number = 0; // Doku
  currentIndex3: number = 0; // Drama
  currentIndex4: number = 0; // Drama

  currentIndexes = {
    category1: 0,
    category2: 0,
    category3: 0,
    category4: 0,
  };

  scrollAmount = 1700;
  activeGroup = 'group0';

  videoItems: VideoItem[] = [];
  groupedSliderVidsDocumentation: { [key: string]: VideoItem[] } = {};
  groupedSliderVidsDrama: { [key: string]: VideoItem[] } = {};
  groupedSliderVidsWatched: { [key: string]: VideoItem[] } = {};
  groupedSliderVids: { [key: string]: VideoItem[] } = {};

  numberOfPacksDocumentation: string[] = [];
  numberOfPacksDrama: string[] = [];
  numberOfPacksWatched: string[] = [];
  numberOfPacks: string[] = [];

  videoItemCardsAmount: number = 7; // amount of videocarditems in a row which should be displayed

  windowSize: number = 0;
  currentUser: User | null = null;
  response: any;
  constructor(
    private backService: BackendCommunicationService,
    public globals: GlobalVariablesService,
    private spinner: NgxSpinnerService
  ) {
    effect(() => {
      // watches continously at the global var currentloggedUser() , if smth changes, effect gets called!
      this.currentUser = this.globals.currentLoggedUser();
      this.response = this.globals.currentVideoResponse();
      if (this.currentUser && this.response) {
        this.synchronizeWatchedSlider();
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.resizeCategory('category1', 1);
    this.resizeCategory('category2', 2);
    this.resizeCategory('category3', 3);
    this.resizeCategory('category4', 4);
    this.customizeCardsAmount()
  }

  ngOnInit() {
    this.customizeCardsAmount()
    this.spinner.show();
    //this.loadSliders();
  }

  synchronizeWatchedSlider() {
    this.groupWatchedVideos(this.response, this.currentUser?.video_timestamps); //Fortsetzen Slider
  }

  customizeCardsAmount() {
    const wasAmount = this.videoItemCardsAmount;
  
    if (window.innerWidth < 1450) {
      this.videoItemCardsAmount = 4;
    } else if (window.innerWidth < 1730) {
      this.videoItemCardsAmount = 5;
    } else if (window.innerWidth < 1920) {
      this.videoItemCardsAmount = 6;
    } else {
      this.videoItemCardsAmount = 7;
    }
  
    if (this.videoItemCardsAmount !== wasAmount) {
      this.cacheClear();
      this.loadSliders();
    }
  }

  cacheClear() {
    this.groupedSliderVids = {}
    this.groupedSliderVidsWatched = {}
    this.groupedSliderVidsDrama = {}
    this.groupedSliderVidsDocumentation = {}
    this.groupedVideosByGenre = {}

    this.numberOfPacksDocumentation = []
    this.numberOfPacksDrama = []
    this.numberOfPacksWatched = []
    this.numberOfPacks = []
    this.videoItems = []
  }

  loadSliders() {
    this.windowSize = window.innerWidth;
    //console.log(this.windowSize);
    this.backService.fetchVideoItems().subscribe({
      next: (resp) => {
        console.log('Hier die Videos: ', resp);
        this.globals.currentVideoResponse.set(resp);
        this.sortVideosByGenre(resp);
        this.groupVideoItems(resp); // Neu Slider
        this.groupVideoItemsByGenre('Drama'); // Drama-Slider
        this.groupVideoItemsByGenre('Dokumentation'); // Doku Slider
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

  groupWatchedVideos(
    videos: VideoItem[],
    watchedVideos: { URL: string; STAMP: number }[]
  ) {
    console.log(videos);
    let groupIndex = 0;
    let tempPack: VideoItem[] = [];

    const watchedVideoItems = videos
      .filter((video) => 
        watchedVideos.some((watched) => watched.URL === video.url) // compares url from watched user vids and all available videos
      )
      .map((video) => { // creates the new video[] with timestamps
        const timestamp =
          watchedVideos.find((watched) => watched.URL === video.url)?.STAMP ||
          null;
        return { ...video, timestamp };
      });
    console.log('Hier die gefundenen Videos: ', watchedVideoItems);

    watchedVideoItems.forEach((video: VideoItem, index: number) => {
      tempPack.push(new VideoItem(video));
      if ( // creation of packs 
        tempPack.length === this.videoItemCardsAmount ||
        index === watchedVideoItems.length - 1
      ) {
        this.groupedSliderVidsWatched[`group${groupIndex}`] = [...tempPack];
        tempPack = [];
        groupIndex++;
      }
    });
    console.log(
      'Hier die gefundenen und fertig gruppierten Videos: ',
      this.groupedSliderVidsWatched
    );
    this.numberOfPacksWatched = Object.keys(this.groupedSliderVidsWatched);
  }

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
    } else if (genre === 'Dokumentation') {
      genreVideos.forEach((video: VideoItem, index: number) => {
        tempPack.push(new VideoItem(video));
        if (
          tempPack.length === this.videoItemCardsAmount ||
          index === genreVideos.length - 1
        ) {
          this.groupedSliderVidsDocumentation[`group${groupIndex}`] = [
            ...tempPack,
          ];
          tempPack = [];
          groupIndex++;
        }
      });
      this.numberOfPacksDocumentation = Object.keys(
        this.groupedSliderVidsDocumentation
      );
    }
  }

  nextVideos(direction: string, category: keyof typeof this.currentIndexes) {
    const sliderCategory = this.getRightCategory(category);

    if (!sliderCategory) {
      console.warn(`Kategorie ${category} existiert nicht.`);
      return;
    }

    const itemWidth = sliderCategory.offsetWidth;
    const maxIndex = this.getRightPacks(category);
    const currentIndex = this.getIndex(category);

    if (direction === '-') {
      this.setIndex(category, Math.min(currentIndex + 1, maxIndex));
    } else {
      this.setIndex(category, Math.max(currentIndex - 1, 0));
    }

    const newPosition = -this.getIndex(category) * itemWidth;
    sliderCategory.style.transform = `translateX(${newPosition}px)`;
  }

  resizeCategory(
    category: keyof typeof this.currentIndexes,
    numbX: number
  ) {
    //numb is the currentPosition 1, 2, 3, 4 etc..
    const sliderCategory = this.getRightCategory(category);
    if (!sliderCategory) {
      console.warn(`Kategorie ${category} existiert nicht.`);
      return;
    }
    const itemWidth = sliderCategory.offsetWidth;
    const cIndex = this.getIndex(category);
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
    } else if (numbX == 4) {
      this.currentPosition4 = newcPosition;
    }
  }

  setIndex(category: keyof typeof this.currentIndexes, newIndex: number) {
    this.currentIndexes[category] = newIndex;
  }

  getIndex(category: keyof typeof this.currentIndexes): number {
    return this.currentIndexes[category] || 0;
  }

  getRightCategory(category: keyof typeof this.currentIndexes) {
    switch (category) {
      case 'category1':
        return this.category1.nativeElement;
      case 'category2':
        return this.category2.nativeElement;
      case 'category3':
        return this.category3.nativeElement;
      case 'category4':
        return this.category4.nativeElement;
      default:
        console.warn(`Kategorie ${category} existiert nicht.`);
        return null;
    }
  }

  getRightPacks(category: string) {
    return category === 'category1'
      ? this.numberOfPacks.length - 1
      : category === 'category2'
      ? this.numberOfPacksDocumentation.length - 1
      : category === 'category3'
      ? this.numberOfPacksDrama.length - 1
      : this.numberOfPacksWatched.length - 1;
  }
}
