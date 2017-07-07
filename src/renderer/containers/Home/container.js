import React, { Component } from 'react'

import { Carousel } from '../../components'

export default ({ media: { movies, shows } }) => (
  </div>
    <Carousel key="1" title="Most popular movies" route="/discover/movies/all/popularity.desc" items={movies.popular} />
    <Carousel key="2" title={"Most popular TV shows"} route="/discover/shows/all/popularity.desc" items={shows.popular} />
    <Carousel key="3" title={"Top rated movies"} route={"/movies/top_rated"} items={movies.topRated} />
    <Carousel key="4" title={"Top rated TV shows"} route={"/tv/top_rated"} items={shows.topRated} />
  </div>
)
