import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { ComponentsModule } from '../../components';
import { ViewModule } from '../view';

import { HomeComponent } from './home.component';
import { HomeResolver } from './home.resolver';

@NgModule({
  imports: [SharedModule, ViewModule, ComponentsModule],
  declarations: [HomeComponent],
  providers: [HomeResolver],
  exports: [HomeComponent],
})
export class HomeModule {}
