import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from '../../app-routing.module';
import { TooltipComponent } from './tooltip.component';
import { TooltipEffects } from './tooltip.effects';
import { TooltipService } from './tooltip.service';

@NgModule({
  declarations: [TooltipComponent],
  providers: [TooltipService],
  imports: [
    CommonModule,
    AppRoutingModule,
    EffectsModule.forFeature([TooltipEffects]),
  ],
  exports: [TooltipComponent],
})
export class TooltipModule {}
