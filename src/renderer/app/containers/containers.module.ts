import { NgModule } from '@angular/core';

import { MediaModule } from './media';
import { HomeModule } from './home';
import { ViewModule } from './view';

@NgModule({
  exports: [
    ViewModule,
    HomeModule,
    MediaModule
  ],
})
export class ContainersModule {}
