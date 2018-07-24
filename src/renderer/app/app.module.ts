import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import '../polyfills';
import { forwardRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ServicesModule } from './services';
import { ContainersModule } from './containers';
import { ComponentsModule } from './components';
import { SharedModule } from './shared.module';

import { MetadataModule, TMDbProvider } from '../metadata';
import { AppConfig } from '../environments';
import { AppComponent } from './app.component';
import {
  TorrentModule,
  YtsTorrentProvider,
  KickassTorrentProvider,
  MagnetDlTorrentProvider,
  ThePirateBayTorrentProvider,
  iDopeTorrentProvider,
} from '../torrent';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServicesModule.forRoot(),
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    TorrentModule.forRoot([
      YtsTorrentProvider,
      ThePirateBayTorrentProvider,
      KickassTorrentProvider,
      MagnetDlTorrentProvider,
      iDopeTorrentProvider,
    ]),
    MetadataModule.forRoot({
      config: AppConfig.tmdb,
      provider: TMDbProvider,
    }),
    ComponentsModule,
    ContainersModule,
  ],
})
export class AppModule {}
