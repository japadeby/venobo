import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppResolver } from './resolvers';
import {
  ViewComponent,
  HomeComponent,
  HomeResolver
} from './containers';

const routes: Routes = [
  {
    path: '',
    resolve: {
      root: AppResolver,
    },
    children: [{
      path: '',
      component: ViewComponent,
      children: [{
        path: '',
        component: HomeComponent,
        resolve: {
          home: HomeResolver,
        },
      }],
    }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
