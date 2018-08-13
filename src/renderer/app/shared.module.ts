import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import { AppStoreModule } from './app-store.module';

@NgModule({
  exports: [
    AppStoreModule,
    CommonModule,
    TranslateModule,
    RouterModule,
    FormsModule,
  ],
})
export class SharedModule {}
