import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/map';
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
import { AppComponent } from './app.component';
import { ResolversModule } from './resolvers';
import { AppConfig } from '../environments';
import { StorageModule } from '../storage';
import { AppRouting } from './app.routing';
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
    StorageModule.forRoot({
      path: AppConfig.cachePath,
      secret: AppConfig.tmdb.key,
      encrypt: {
        type: 'AES',
        fileContent: true,
        fileName: true,
      },
    }),
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
    ResolversModule,
    SharedModule,
    AppRouting,
  ],
})
export class AppModule {}
