import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { ComponentsModule } from './components';
import { MetadataModule } from './modules/metadata/metadata.module';
import { AppConfig } from '../environments';
import {
  TorrentModule,
  YtsTorrentProvider,
  KickassTorrentProvider,
  MagnetDlTorrentProvider,
  ThePirateBayTorrentProvider,
} from './modules/torrent';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    WebviewDirective
  ],
  imports: [
    ComponentsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TorrentModule.forRoot([
      new YtsTorrentProvider(),
      new ThePirateBayTorrentProvider(),
      new KickassTorrentProvider(),
      new MagnetDlTorrentProvider(),
    ]),
    MetadataModule.forRoot(AppConfig),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
