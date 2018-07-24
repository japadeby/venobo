import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppStoreModule } from './app-store.module';

@NgModule({
  exports: [
    AppStoreModule,
    CommonModule,
    TranslateModule,
    AppRoutingModule,
    FormsModule,
  ],
  /*imports: [
    AppRoutingModule,
  ],*/
})
export class SharedModule {}
