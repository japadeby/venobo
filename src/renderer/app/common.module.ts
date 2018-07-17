import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MetadataModule } from './modules/metadata';
import { TorrentModule } from './modules/torrent';
import { AppRoutingModule } from './app-routing.module';
import { AppStoreModule } from './app-store.module';

@NgModule({
  exports: [
    AppStoreModule,
    TranslateModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    MetadataModule,
    TorrentModule,
    BrowserModule,
  ],
  imports: [
    AppStoreModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
})
export class CommonModule {}
