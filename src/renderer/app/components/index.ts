import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

export * from './search';
export * from './view';
export * from './home';

import { HomeComponent } from './home';
import { HeaderComponent } from './header';
import { ViewComponent } from './view';
import { CarouselComponent } from './carousel';
import { PosterComponent } from './poster';
import { SearchModule, searchReducer } from './search';

import { CommonModule } from '../common.module';

// Fuck this shit is retarded
@NgModule({
  imports: [
    /*EffectsModule.forRoot([
      search: searchReducer,
    ]),*/
    CommonModule,
    SearchModule,
  ],
  declarations: [
    HomeComponent,
    HeaderComponent,
    ViewComponent,
    CarouselComponent,
    PosterComponent,
  ],
  exports: [
    EffectsModule,
    SearchModule,
    HomeComponent,
    HeaderComponent,
    ViewComponent,
    CarouselComponent,
    PosterComponent,
  ],
})
export class ComponentsModule {}
