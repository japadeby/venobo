import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { ComponentsModule } from '../../components';

import { MediaComponent } from './media.component';
import { MediaResolver } from './media.resolver';

@NgModule({
  imports: [SharedModule, ComponentsModule],
  declarations: [MediaComponent],
  providers: [MediaResolver],
  exports: [MediaComponent],
})
export class MediaModule {}
