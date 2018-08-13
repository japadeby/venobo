import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../shared.module';
import { TooltipComponent } from './tooltip.component';
import { TooltipEffects } from './tooltip.effects';
import { TooltipService } from './tooltip.service';

@NgModule({
  declarations: [TooltipComponent],
  providers: [TooltipService],
  imports: [
    SharedModule,
    EffectsModule.forFeature([TooltipEffects]),
  ],
  exports: [TooltipComponent],
})
export class TooltipModule {}
