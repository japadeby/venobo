import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MediaResolver } from './media.resolver';
import { MediaComponent } from './media.component';

const routes: Routes = [{
  path: '',
  component: MediaComponent,
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  resolve: {
    media: MediaResolver,
  },
}];

export const MediaRouting: ModuleWithProviders = RouterModule.forChild(routes);
