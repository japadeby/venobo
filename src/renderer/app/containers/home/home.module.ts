import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { ComponentsModule } from '../../components';

import { HomeComponent } from './home.component';

@NgModule({
  imports: [SharedModule, ComponentsModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
