import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared.module';
import { ViewModule } from '../view';

import { HomeComponent } from './home.component';
import { HomeResolver } from './home.resolver';

@NgModule({
  imports: [SharedModule, ViewModule],
  declarations: [HomeComponent],
  providers: [HomeResolver],
  exports: [HomeComponent],
})
export class HomeModule {}
