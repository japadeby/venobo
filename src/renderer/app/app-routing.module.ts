import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  TopRatedMoviesResolver,
  PopularMoviesResolver,
} from './resolvers';

import {
  MediaComponent,
  HomeComponent,
  MediaResolver,
} from './containers';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    resolve: {
      topRatedMovies: TopRatedMoviesResolver,
      popularMovies: PopularMoviesResolver,
    },
  },
  {
    path: 'media/:type/:id',
    component: MediaComponent,
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    resolve: {
      media: MediaResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
