import { NgModule } from '@angular/core';

import { LoaderModule } from './loader';
import { PosterModule } from './poster';
import { CarouselModule } from './carousel';
import { SearchModule } from './search';
import { HeaderModule } from './header';
import { TooltipModule } from './tooltip';

@NgModule({
  exports: [
    LoaderModule,
    TooltipModule,
    PosterModule,
    CarouselModule,
    SearchModule,
    HeaderModule,
  ],
})
export class ComponentsModule {}
