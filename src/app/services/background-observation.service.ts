import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GlobalVariablesService } from './global-variables.service';

@Injectable({
  providedIn: 'root',
})
export class BackgroundObservationService {
  private renderer: Renderer2;

  constructor(
    private router: Router,
    rendererFactory: RendererFactory2,
    public globals: GlobalVariablesService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.setupRouteListener();
  }

  private setupRouteListener() {
    this.router.events // alle routing events
      .pipe(filter((event) => event instanceof NavigationEnd)) // events werden gefiltert nach navigationend events
      .subscribe((event) => {
        //navigationend events werden subscribed
        this.updateBackground((event as NavigationEnd).urlAfterRedirects); //url wird uebergeben
        this.globals.isVidOpen.set(false);
      });
  }

  private updateBackground(url: string) {
    this.removeBodyClasses();
    console.log(url);
    switch (true) {
      case url.includes('/login'):
        this.renderer.addClass(document.body, 'login-page');
        break;
      case url.includes('/registration'):
        this.renderer.addClass(document.body, 'registration-page');
        break;
      case url.includes('/main'):
        this.globals.isMainSiteActive.set(true);
        this.renderer.addClass(document.body, 'logged-in');
        break;
      case url.includes('/pw-reset'):
        this.renderer.addClass(document.body, 'login-page');
        break;
      case url.includes('/policy'):
        this.renderer.addClass(document.body, 'logged-in');
        break;
      case url.includes('/imprint'):
        this.renderer.addClass(document.body, 'logged-in');
        break;
      case url.includes('/terms'):
        this.renderer.addClass(document.body, 'logged-in');
        break;
      case url.includes('/profile'):
        this.renderer.addClass(document.body, 'profile-page');
        break;
      default:
        this.renderer.addClass(document.body, 'landing-page');
        break;
    }
  }

  private removeBodyClasses() {
    this.globals.isMainSiteActive.set(false);
    this.renderer.removeClass(document.body, 'login-page');
    this.renderer.removeClass(document.body, 'registration-page');
    this.renderer.removeClass(document.body, 'logged-in');
    this.renderer.removeClass(document.body, 'profile-page');
    this.renderer.removeClass(document.body, 'landing-page');
  }
}
