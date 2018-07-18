import { NgModule } from '@angular/core';

import { LoaderComponent } from './loader.component';

import { SharedModule } from '../../shared.module';

@NgModule({
  imports: [SharedModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent],
})
export class LoaderModule {}

