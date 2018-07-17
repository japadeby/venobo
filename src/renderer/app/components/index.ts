import { NgModule } from '@angular/core';

export { HomeComponent } from './home/home.component';
export { HeaderComponent } from './header/header.component';
export { ViewComponent } from './view/view.component';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    ViewComponent,
  ]
})
export class ComponentsModule {}
