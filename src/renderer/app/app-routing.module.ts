import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  TopRatedMoviesResolver,
  PopularMoviesResolver,
} from './resolvers';

import {
  ViewComponent,
  HomeComponent,
} from './containers';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      topRatedMovies: TopRatedMoviesResolver,
      popularMovies: PopularMoviesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
