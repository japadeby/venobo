import { NgModule } from '@angular/core';

import { PopularMoviesResolver } from './popular-movies.resolver';
import { TopRatedMoviesResolver } from './top-rated-movies.resolver';

@NgModule({
  providers: [
    PopularMoviesResolver,
    TopRatedMoviesResolver,
  ],
})
export class ResolversModule {}
