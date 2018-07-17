import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ipcRenderer } from 'electron';

import { Router } from '@angular/router';

import { AppConfig } from '../environments/environment';
import { TorrentService } from './modules/torrent';
import { ElectronService } from './providers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  appReady!: Promise<boolean>;

  constructor(
    private readonly electronService: ElectronService,
    private readonly translate: TranslateService,
    private readonly torrentService: TorrentService,
    private readonly router: Router,
  ) {}

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
