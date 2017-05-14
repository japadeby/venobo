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

export default class MoviePage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {props} = this
    const {data} = props

    return (
      <ContentProduct>
        <section id="movie-product">
          <Hero>
            <Scaffold>
              <HeroWrapper>
                <img className="hero" src={data.backdrop} />
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
                  <img className="poster" src={data.poster} />
                </div>
                <h1 className="product-title">{data.title}</h1>
                <p className="summary">
                  <span className="genre divider">
                    {data.genres.map(genre => {
                      return (<span className="genre-type">{genre}</span>)
                    })}
                  </span>
                  <span className="year divider">
                    <span>{data.year}</span>
                  </span>
                  <span className="duration divider">
                    <span>{data.runtime}</span>
                  </span>
                  <span className="flags">
                    {data.torrents.map(torrent => {
                      return (<span className="flag">{torrent.quality}</span>)
                    })}
                  </span>
                </p>
                <div className="interaction-block">
                  <div className="tmdb-container">
                    <a className="tmdb-link">{data.voted} <span className="tmdb-votes">baseret på {data.votes} brugere</span></a>
                  </div>
                  <StarredIcon tmdb={data.tmdb} state={props.state} />
                </div>
                <span></span>
                <div className="group">
                  <div className="group">
                    <div className="synopsis">
                      {data.summary}
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
      </ContentProduct>
    )
  }

}
