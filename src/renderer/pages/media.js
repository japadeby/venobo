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

export default class MediaPage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {props} = this
    const {similar, media, recommendations} = props.data

    return (
      <ContentProduct>
        <section id="movie-product">
          <Hero>
            <Scaffold>
              <HeroWrapper>
                <img className="hero" src={media.backdrop} />
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
                  <img className="poster" src={media.poster} />
                </div>
                <h1 className="product-title">{media.title}</h1>
                <p className="summary">
                  <span className="genre divider">
                    {media.genres.map(genre => {
                      return (<span className="genre-type" key={genre}>{genre}</span>)
                    })}
                  </span>
                  <span className="year divider">
                    <span>{media.year}</span>
                  </span>
                  <span className="duration divider">
                    <span>{media.runtime}</span>
                  </span>
                  <span className="flags">
                    {Object.keys(media.torrents).map(quality => {
                      return (<span className="flag" key={quality}>{quality}</span>)
                    })}
                  </span>
                </p>
                <div className="interaction-block">
                  <div className="tmdb-container">
                    {/*{translate('torrent.votes', {votes: media.votes})}*/}
                    <a className="tmdb-link">{media.voted} <span className="tmdb-votes">baseret på {media.votes} brugere</span></a>
                  </div>
                  <StarredIcon tmdb={media.tmdb} state={props.state} />
                </div>
                <span></span>
                <div className="group">
                  <div className="group">
                    <div className="synopsis">
                      {media.summary}
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
        <Carousel title={"Recomendations"} items={recommendations} state={props.state} />
      </ContentProduct>
    )
  }

}
