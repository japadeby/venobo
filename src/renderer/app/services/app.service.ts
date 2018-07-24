import { Injectable, Injector } from '@angular/core';
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

import { ConfigService } from './config.service';

@Injectable()
export class AppService {

  constructor(
    private readonly translate: TranslateService,
    private readonly config: ConfigService,
    private readonly injector: Injector,
  ) {}

  public async create() {
    this.injector.get(Router).events.subscribe(
      (event: RouterEvent) => this.navigationInterceptor(event),
    );

    this.translate.setDefaultLang('en-US');

    ipcRenderer.emit('RENDERER_FINISHED');
    console.log('[Venobo] - AppService: Initialized...');
  }

  private navigationInterceptor(event: RouterEvent) {
    /*if (event instanceof NavigationStart) {
      this.canActivate = new Promise(p => this.activate = p);
    }*/

    if (event instanceof NavigationCancel) {
      // console.log('NavigationCancel', event);
    }

    /*if (event instanceof NavigationEnd) {
      this.activate();
    }*/

    if (event instanceof ResolveEnd) {
      // console.log('ResolveEnd');
    }
  }

}
