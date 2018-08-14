import { createLazyChildRoute } from '../../utils';
import { HomeComponent } from './home.component';
import {
  PopularMoviesResolver,
  TopRatedMoviesResolver,
} from '../../resolvers';

export const HomeRouting = createLazyChildRoute(HomeComponent, {
  resolve: {
    topRatedMovies: TopRatedMoviesResolver,
    popularMovies: PopularMoviesResolver,
  },
});
