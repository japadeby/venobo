import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SearchComponent } from './search.component';
import { SearchEffects } from './search.effects';

@NgModule({
  declarations: [SearchComponent],
  imports: [EffectsModule.forFeature([SearchEffects])],
  exports: [SearchComponent],
})
export class SearchModule {}

