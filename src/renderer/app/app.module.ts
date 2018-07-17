import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers';
import { ComponentsModule } from './components';
import { AppComponent } from './app.component';

import { MetadataModule, TMDbProvider } from './modules/metadata';
import { CommonModule } from './common.module';
import { AppConfig } from '../environments';
import {
  TorrentModule,
  YtsTorrentProvider,
  KickassTorrentProvider,
  MagnetDlTorrentProvider,
  ThePirateBayTorrentProvider,
  iDopeTorrentProvider,
} from './modules/torrent';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    TorrentModule.forRoot([
      new YtsTorrentProvider(),
      new ThePirateBayTorrentProvider(),
      new KickassTorrentProvider(),
      new MagnetDlTorrentProvider(),
      new iDopeTorrentProvider(),
    ]),
    MetadataModule.forRoot({
      config: AppConfig.tmdb,
      providers: [TMDbProvider],
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ComponentsModule,
    CommonModule,
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent],
})
export class AppModule {}
