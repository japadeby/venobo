import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components';

import { ViewComponent } from './view.component';

@NgModule({
  imports: [ComponentsModule],
  declarations: [ViewComponent],
  exports: [ViewComponent],
})
export class ViewModule {}
