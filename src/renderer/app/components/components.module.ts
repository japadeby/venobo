import { NgModule } from '@angular/core';

import { LoaderModule } from './loader';
import { PosterModule } from './poster';
import { CarouselModule } from './carousel';
import { SearchModule } from './search';
import { HeaderModule } from './header';

// import { SharedModule } from '../shared.module';

@NgModule({
  exports: [
    LoaderModule,
    PosterModule,
    CarouselModule,
    SearchModule,
    HeaderModule,
    // PosterModule,
    // CarouselModule,
    // SearchModule,
    // HeaderModule,
    // ViewComponent,
  ],
})
export class ComponentsModule {}
