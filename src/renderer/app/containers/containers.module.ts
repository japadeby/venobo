import { NgModule } from '@angular/core';

import { HomeModule } from './home';
import { ViewModule } from './view';

@NgModule({
  exports: [
    ViewModule,
    HomeModule,
  ],
})
export class ContainersModule {}
