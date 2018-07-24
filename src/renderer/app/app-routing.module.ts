import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  ViewComponent,
  HomeComponent,
  HomeResolver
} from './containers';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      home: HomeResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
