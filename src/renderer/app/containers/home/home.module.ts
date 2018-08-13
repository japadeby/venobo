import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { ComponentsModule } from '../../components';

import { HomeComponent } from './home.component';
import { HomeRouting } from './home.routing';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    HomeRouting,
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
