import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostListener,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VideoItemComponent } from './video-item/video-item.component';
import { BackendCommunicationService } from '../../services/backend-communication.service';
import { VideoItem } from '../../models/videoItem.class';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { User } from '../../models/user.class';

interface Category {
  name: string;
  ref: ElementRef<HTMLElement> | null;
  currentPosition: number;
  currentIndex: number;
  hoveredIndex: number;
  groupedVideos: { [key: string]: VideoItem[] };
  numberOfPacks: string[];
}

@Component({
  selector: 'app-slider-comp',
  templateUrl: './slider-comp.component.html',
  imports: [CommonModule, MatIconModule, VideoItemComponent, NgxSpinnerComponent],
  styleUrls: ['./slider-comp.component.scss'],
})
export class SliderCompComponent implements AfterViewInit {
  categories: Category[] = [
    {
      name: 'Neu auf VideoFlix',
      ref: null,
      currentPosition: 0,
      currentIndex: 0,
      hoveredIndex: -1,
      groupedVideos: {},
      numberOfPacks: [],
    },
    {
      name: 'Watched',
      ref: null,
      currentPosition: 0,
      currentIndex: 0,
      hoveredIndex: -1,
      groupedVideos: {},
      numberOfPacks: [],
    },
    {
      name: 'Dokumentation',
      ref: null,
      currentPosition: 0,
      currentIndex: 0,
      hoveredIndex: -1,
      groupedVideos: {},
      numberOfPacks: [],
    },
    {
      name: 'Drama',
      ref: null,
      currentPosition: 0,
      currentIndex: 0,
      hoveredIndex: -1,
      groupedVideos: {},
      numberOfPacks: [],
    },
    {
      name: 'Action',
      ref: null,
      currentPosition: 0,
      currentIndex: 0,
      hoveredIndex: -1,
      groupedVideos: {},
      numberOfPacks: [],
    },
    {
      name: 'Drohne',
      ref: null,
      currentPosition: 0,
      currentIndex: 0,
      hoveredIndex: -1,
      groupedVideos: {},
      numberOfPacks: [],
    },
  ];

  @ViewChildren('categoryRef', { read: ElementRef }) categoryRefs!: QueryList<ElementRef<HTMLElement>>;
  videoItemCardsAmount: number = 7;
  groupedVideosByGenre: { [key: string]: VideoItem[] } = {};
  currentUser: User | null = null;
  response: VideoItem[] | null = null;
  private previousTimestamps: { URL: string; STAMP: number }[] | null = null;

  constructor(
    private backService: BackendCommunicationService,
    public globals: GlobalVariablesService,
    private spinner: NgxSpinnerService
  ) {
    effect(() => {
      this.currentUser = this.globals.currentLoggedUser();
      this.response = this.globals.currentVideoResponse();
      const isDataLoaded = this.globals.isDataLoaded();
      console.log('Effect triggered:', {
        isDataLoaded,
        user: this.currentUser,
        response: this.response,
      });

      if (!isDataLoaded && (this.currentUser || !this.response)) {
        console.log('Initial load');
        this.loadSliders();
      } else if (this.currentUser && this.response) {
        console.log('Timestamps changed, synchronizing Watched slider');
        this.previousTimestamps = this.currentUser.video_timestamps ? [...this.currentUser.video_timestamps] : null;
        this.synchronizeWatchedSlider();
      }
    });
  }

  private hasTimestampsChanged(currentTimestamps: { URL: string; STAMP: number }[] | null | undefined): boolean {
    if (!this.previousTimestamps && !currentTimestamps) return false;
    if (!this.previousTimestamps || !currentTimestamps) return true;

    if (this.previousTimestamps.length !== currentTimestamps.length) return true;

    return this.previousTimestamps.some((prev, index) => {
      const curr = currentTimestamps[index];
      return !curr || prev.URL !== curr.URL || prev.STAMP !== curr.STAMP;
    });
  }

  synchronizeWatchedSlider() {
    if (this.response && this.currentUser?.video_timestamps) {
      const watchedCategory = this.categories.find((category) => category.name === 'Watched');
      if (watchedCategory) {
        this.groupWatchedVideos(this.response, this.currentUser.video_timestamps, watchedCategory);
      }
    }
  }

  groupWatchedVideos(videos: VideoItem[], watchedVideos: { URL: string; STAMP: number }[], category: Category) {
    let groupIndex = 0;
    let tempPack: VideoItem[] = [];

    const watchedVideoItems = videos
      .filter((video) => watchedVideos.some((watched) => watched.URL === video.url))
      .map((video) => {
        const timestamp = watchedVideos.find((watched) => watched.URL === video.url)?.STAMP || 0;
        return { ...video, timestamp, duration: video.duration || 1 };
      });

    // Lösche vorherige Daten der Kategorie
    category.groupedVideos = {};
    category.numberOfPacks = [];

    watchedVideoItems.forEach((video: VideoItem, index: number) => {
      tempPack.push(new VideoItem(video));
      if (tempPack.length === this.videoItemCardsAmount || index === watchedVideoItems.length - 1) {
        category.groupedVideos[`group${groupIndex}`] = [...tempPack];
        tempPack = [];
        groupIndex++;
      }
    });

    category.numberOfPacks = Object.keys(category.groupedVideos);
  }

  ngAfterViewInit() {
    this.categoryRefs.forEach((ref, index) => {
      this.categories[index].ref = ref;
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.customizeCardsAmount();
    this.categories.forEach((category, index) => {
      if (category.ref) {
        const itemWidth = category.ref.nativeElement.offsetWidth;
        category.currentPosition = -category.currentIndex * itemWidth;
        category.ref.nativeElement.style.transform = `translateX(${category.currentPosition}px)`;
      }
    });
  }

  ngOnInit() {
    this.customizeCardsAmount();
    this.spinner.show();
    this.loadSliders();
  }

  customizeCardsAmount() {
    const breakpoints = [
      { maxWidth: 690, cards: 2 },
      { maxWidth: 1160, cards: 3 },
      { maxWidth: 1450, cards: 4 },
      { maxWidth: 1730, cards: 5 },
      { maxWidth: 1920, cards: 6 },
      { maxWidth: Infinity, cards: 7 },
    ];

    const wasAmount = this.videoItemCardsAmount;
    this.videoItemCardsAmount = breakpoints.find((bp) => window.innerWidth < bp.maxWidth)!.cards;

    if (this.videoItemCardsAmount !== wasAmount) {
      this.cacheClear();
      this.loadSliders();
    }
  }

  cacheClear() {
    this.categories.forEach((category) => {
      category.groupedVideos = {};
      category.numberOfPacks = [];
    });
    this.groupedVideosByGenre = {};
  }

  sortVideosByGenre(videos: VideoItem[]) {
    videos.forEach((video) => {
      if (!this.groupedVideosByGenre[video.genre]) {
        this.groupedVideosByGenre[video.genre] = [];
      }
      this.groupedVideosByGenre[video.genre].push(video);
    });
  }

  groupVideos(videos: VideoItem[], category: Category, filterFn?: (video: VideoItem) => boolean) {
    let groupIndex = 0;
    let tempPack: VideoItem[] = [];
    const filteredVideos = filterFn ? videos.filter(filterFn) : videos;

    filteredVideos.forEach((video, index) => {
      tempPack.push(new VideoItem(video));
      if (tempPack.length === this.videoItemCardsAmount || index === filteredVideos.length - 1) {
        category.groupedVideos[`group${groupIndex}`] = [...tempPack];
        tempPack = [];
        groupIndex++;
      }
    });
    category.numberOfPacks = Object.keys(category.groupedVideos);
  }

  loadSliders() {
    this.spinner.show();
    this.backService.fetchVideoItems().subscribe({
      next: (resp: VideoItem[]) => {
        this.globals.currentVideoResponse.set(resp);
        this.sortVideosByGenre(resp);

        this.groupVideos(resp, this.categories[0]); // Neu auf VideoFlix
        this.groupVideos(resp, this.categories[2], (video) => video.genre === 'Dokumentation');
        this.groupVideos(resp, this.categories[3], (video) => video.genre === 'Drama');
        this.groupVideos(resp, this.categories[4], (video) => video.genre === 'Action');
        this.groupVideos(resp, this.categories[5], (video) => video.genre === 'Drohne');

        if (this.currentUser) {
          const watchedVideos = resp
            .filter((video) =>
              this.currentUser!.video_timestamps.some(
                (watched: { URL: string; STAMP: any }) => watched.URL === video.url
              )
            )
            .map((video) => ({
              ...video,
              timestamp:
                this.currentUser!.video_timestamps.find(
                  (watched: { URL: string; STAMP: any }) => watched.URL === video.url
                )?.STAMP || null,
            }));
          this.groupVideos(watchedVideos, this.categories[1]);
        }
        this.globals.isDataLoaded.set(true);
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  nextVideos(direction: string, categoryIndex: number) {
    const category = this.categories[categoryIndex];
    if (!category.ref) return;

    const itemWidth = category.ref.nativeElement.offsetWidth;
    const maxIndex = category.numberOfPacks.length - 1;

    if (direction === '-') {
      category.currentIndex = Math.min(category.currentIndex + 1, maxIndex);
    } else {
      category.currentIndex = Math.max(category.currentIndex - 1, 0);
    }

    category.currentPosition = -category.currentIndex * itemWidth;
    category.ref.nativeElement.style.transform = `translateX(${category.currentPosition}px)`;
  }
}
