import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import {
  PopularMoviesResolver,
  TopRatedMoviesResolver,
} from '../../resolvers';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  resolve: {
    topRatedMovies: TopRatedMoviesResolver,
    popularMovies: PopularMoviesResolver,
  },
}];

export const HomeRouting: ModuleWithProviders = RouterModule.forChild(routes);
