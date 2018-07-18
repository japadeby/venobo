import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/timeout';
import '../polyfills';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ServicesModule } from './services';
import { ResolversModule } from './resolvers';
import { ContainersModule } from './containers';
import { ComponentsModule } from './components';
import { SharedModule } from './shared.module';

import { MetadataModule, TMDbProvider } from './modules/metadata';
import { AppConfig } from '../environments';
import { AppComponent } from './app.component';
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
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    ServicesModule,
    ResolversModule,
    SharedModule,
    TorrentModule.forRoot([
      YtsTorrentProvider,
      ThePirateBayTorrentProvider,
      KickassTorrentProvider,
      MagnetDlTorrentProvider,
      iDopeTorrentProvider,
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
    ContainersModule,
  ],
})
export class AppModule {}
