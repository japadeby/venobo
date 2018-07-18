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
    BrowserModule,
    TranslateModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    MetadataModule,
    TorrentModule,
  ],
  imports: [
    BrowserModule,
    AppStoreModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
})
export class SharedModule {}
