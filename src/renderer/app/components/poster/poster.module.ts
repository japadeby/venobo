import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { PosterComponent } from './poster.component';

@NgModule({
  imports: [SharedModule],
  declarations: [PosterComponent],
  exports: [PosterComponent],
})
export class PosterModule {}

