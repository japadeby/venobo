import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { PlayerComponent } from './player.component';
import { PlayerRouting } from './player.routing';

@NgModule({
  imports: [
    SharedModule,
    PlayerRouting,
  ],
  declarations: [
    PlayerComponent,
  ],
})
export class PlayerModule {}
