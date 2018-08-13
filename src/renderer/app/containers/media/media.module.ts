import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { ComponentsModule } from '../../components';

import { MediaComponent } from './media.component';
import { MediaResolver } from './media.resolver';
import { MediaRouting } from './media.routing';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    MediaRouting,
  ],
  declarations: [MediaComponent],
  providers: [MediaResolver],
  exports: [MediaComponent],
})
export class MediaModule {}
