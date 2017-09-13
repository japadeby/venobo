import React, { Component } from 'react'
import { connect } from 'react-redux'

import { ContentSection, Loader } from '../../components/Items'
import { Carousel } from '../../components'
import { homeActions } from './redux'

@connect(
  state => ({ ...state.home }),
  { ...homeActions }
)
export default class HomeController extends Component {

  componentDidMount = () => this.props.fetchMedia()

  render() {
    const { isReady, media: { movies, shows } } = this.props

    return isReady ? (
      <ContentSection>
        <Carousel key="1" title="Most popular " route="/discover/movies/all/popularity.desc" items={movies.popular} />
        <Carousel key="2" title="Most popular TV shows" route="/discover/shows/all/popularity.desc" items={shows.popular} />
        <Carousel key="3" title="Top rated movies" route="/movies/top_rated" items={movies.topRated} />
        <Carousel key="4" title="Top rated TV shows" route="/tv/top_rated" items={shows.topRated} />
      </ContentSection>
    ) : (
      <Loader spinner="dark" container="dark" />
    )
  }

}
