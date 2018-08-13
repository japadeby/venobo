import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerComponent } from './player.component';

const routes: Routes = [{
  path: '',
  component: PlayerComponent,
}];

export const PlayerRouting: ModuleWithProviders = RouterModule.forChild(routes);
