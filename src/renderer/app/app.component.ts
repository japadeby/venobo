import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ipcRenderer } from 'electron';
import {
  Router,
  RouterEvent,
  NavigationStart,
  ResolveEnd,
  NavigationCancel,
  NavigationEnd,
} from '@angular/router';

import { AppConfig } from '../environments/environment';
import { TorrentService } from './modules/torrent';
import { ElectronService } from './providers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  appResolve!: () => void;
  appReady!: Promise<boolean>;

  routeResolving!: Promise<boolean>;

  constructor(
    private readonly electronService: ElectronService,
    private readonly translate: TranslateService,
    private readonly torrentService: TorrentService,
    private readonly router: Router,
  ) {
    this.router.events.subscribe(
      (event: RouterEvent) => this.navigationInterceptor(event)
    );
  }

  private navigationInterceptor(event: RouterEvent) {
    if (event instanceof NavigationStart) {
      console.log('NavigationStart');
      this.appReady = new Promise(p => this.appResolve = p);
    }

    if (event instanceof NavigationCancel) {
      console.log('NavigationCancel');
    }

    if (event instanceof NavigationEnd) {
      console.log('NavigationEnd');
      this.appResolve();
    }

    if (event instanceof ResolveEnd) {
      console.log('ResolveEnd');
    }
  }

  async ngOnInit() {
    this.translate.setDefaultLang('en-US');
    console.log('AppConfig', AppConfig);

    await this.torrentService.create();

    if (this.electronService.isElectron()) {
      console.log('Mode electron');
    } else {
      console.log('Mode web');
    }

    this.appReady = Promise.resolve(true);
    ipcRenderer.emit('RENDERER_FINISHED');
  }
}
