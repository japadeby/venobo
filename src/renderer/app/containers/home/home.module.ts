import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { ComponentsModule } from '../../components';
import { ViewModule } from '../view';

import { HomeComponent } from './home.component';

@NgModule({
  imports: [SharedModule, ViewModule, ComponentsModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
