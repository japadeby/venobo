import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: './containers/home/home.module#HomeModule',
  },
  {
    path: 'media/:type/:id',
    loadChildren: './containers/media/media.module#MediaModule',
  },
];

export const AppRouting: ModuleWithProviders =
  RouterModule.forRoot(routes, { useHash: true });

