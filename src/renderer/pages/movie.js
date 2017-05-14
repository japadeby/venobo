import React from 'react'

import {dispatch} from '../lib/dispatcher'

import {
  ContentProduct,
  Hero,
  MovieProduct,
  HeroWrapper,
  PlayerWrapper,
  StarredIcon,
  Scaffold
} from '../components/items'
import Carousel from '../components/carousel'

export default class MoviePage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {props} = this
    const {similar, movie} = props.data

    return (
      <ContentProduct>
        <section id="movie-product">
          <Hero>
            <Scaffold>
              <HeroWrapper>
                <img className="hero" src={movie.backdrop} />
                <div className="hero-backdrop"></div>
                <div className="hero-vignette"></div>
              </HeroWrapper>
            </Scaffold>
          </Hero>
          <MovieProduct>
            <Scaffold>
              <PlayerWrapper />
              <div className="metadata">
                <div className="thumb portrait thumb-dk">
                  <img className="poster" src={movie.poster} />
                </div>
                <h1 className="product-title">{movie.title}</h1>
                <p className="summary">
                  <span className="genre divider">
                    {movie.genres.map(genre => {
                      return (<span className="genre-type" key={genre}>{genre}</span>)
                    })}
                  </span>
                  <span className="year divider">
                    <span>{movie.year}</span>
                  </span>
                  <span className="duration divider">
                    <span>{movie.runtime}</span>
                  </span>
                  <span className="flags">
                    {movie.torrents.map(torrent => {
                      return (<span className="flag" key={torrent.quality}>{torrent.quality}</span>)
                    })}
                  </span>
                </p>
                <div className="interaction-block">
                  <div className="tmdb-container">
                    <a className="tmdb-link">{movie.voted} <span className="tmdb-votes">baseret på {movie.votes} brugere</span></a>
                  </div>
                  <StarredIcon tmdb={movie.tmdb} state={props.state} />
                </div>
                <span></span>
                <div className="group">
                  <div className="group">
                    <div className="synopsis">
                      {movie.summary}
                    </div>
                  </div>
                  <div className="group">
                    <div className="actors people-list">
                      <h2></h2>
                    </div>
                    <div className="directors people-list">
                      <h2></h2>
                    </div>
                  </div>
                </div>
              </div>
            </Scaffold>
          </MovieProduct>
        </section>
        <Carousel title={"Lignende film"} items={similar} state={props.state} />
      </ContentProduct>
    )
  }

}
