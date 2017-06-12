/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import React from 'react'

import Carousel from '../components/carousel'

export default class HomePage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {props} = this

    return (
      <div>
        <Carousel key="1" title="Most popular movies" route="/discover/movies/all/popularity.desc" items={props.media.movies.popular} state={props.state} />
        <Carousel key="2" title={"Most popular TV shows"} route="/discover/shows/all/popularity.desc" items={props.media.shows.popular} state={props.state} />
        <Carousel key="3" title={"Top rated movies"} route={"/movies/top_rated"} items={props.media.movies.topRated} state={props.state} />
        <Carousel key="4" title={"Top rated TV shows"} route={"/tv/top_rated"} items={props.media.shows.topRated} state={props.state} />
      </div>
    )
  }

}
