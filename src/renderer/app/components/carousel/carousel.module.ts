import { NgModule } from '@angular/core';

import { CarouselComponent } from './carousel.component';

import { PosterModule } from '../poster';
import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [SharedModule, PosterModule],
  declarations: [CarouselComponent],
  exports: [CarouselComponent],
})
export class CarouselModule {}

