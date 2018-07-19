import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ipcRenderer } from 'electron';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  RouterEvent,
  ResolveEnd,
  Router,
} from '@angular/router';

// import { AppConfig } from '../../environments/environment';
import { TorrentService } from '../modules/torrent';

@Injectable()
export class AppService {

  protected activate: () => void;
  public canActivate!: Promise<boolean>;

  constructor(
    private readonly torrentService: TorrentService,
    private readonly translate: TranslateService,
    private readonly router: Router,
  ) {
    this.router.events.subscribe(
      (event: RouterEvent) => this.navigationInterceptor(event)
    );
  }

  private navigationInterceptor(event: RouterEvent) {
    // console.log(event);

    if (event instanceof NavigationStart) {
      this.canActivate = new Promise(p => this.activate = p);
    }

    if (event instanceof NavigationCancel) {
      // console.log('NavigationCancel', event);
    }

    if (event instanceof NavigationEnd) {
      this.activate();
    }

    if (event instanceof ResolveEnd) {
      // console.log('ResolveEnd');
    }
  }

  public async init() {
    this.translate.setDefaultLang('en-US');
    // console.log('AppConfig', AppConfig);

    // await this.torrentService.create();

    this.canActivate = Promise.resolve(true);
    ipcRenderer.emit('RENDERER_FINISHED');

    // await this.router.navigateByUrl('/home');
  }

}
