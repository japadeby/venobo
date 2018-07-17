import { NgModule } from '@angular/core';

export { ViewComponent } from './view/view.component';
export { HomeComponent } from './home/home.component';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ViewComponent } from './view/view.component';
import { CarouselComponent } from './carousel/carousel.component';
import { PosterComponent } from './poster/poster.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    ViewComponent,
    CarouselComponent,
    PosterComponent,
  ]
})
export class ComponentsModule {}
