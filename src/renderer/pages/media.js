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
                  {media.type === 'movie' &&
                    <span className="duration divider">
                      <span>{media.runtime}</span>
                    </span>
                  }
                  {media.type === 'movie' &&
                    <span className="flags">
                      {Object.keys(media.torrents).map(quality => {
                        return (<span className="flag" key={quality}>{quality}</span>)
                      })}
                    </span>
                  }
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
        {media.type === 'show' &&
          <div>
            <div className="block season-navigation landscape">
              <Scaffold>
                <span className="label">Sæson</span>
                <div className="tabs">
                  <a href="">1</a>
                  <a href="">2</a>
                </div>
              </Scaffold>
            </div>
            <section className="block season landscape">
              <Scaffold>
                <div className="episodes">
                  <div className="episode table">
                    <div className="front">
                      <h3>
                        <a className="episode-link">
                          <div className="front-image episode-img"></div>
                        </a>
                      </h3>
                      <div className="backdrop small">
                        <div className="box">
                          <div className="play-link"></div>
                          <div className="load-spinner dark small"></div>
                        </div>
                      </div>
                    </div>
                    <div className="meta-data-container">
                      <div className="meta">
                        <span className="title">1. Through a Glass</span>
                        <span className="episode-length">57min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Scaffold>
            </section>
          </div>
        }
        <Carousel title={"Lignende film"} items={similar} state={props.state} />
        <Carousel title={"Recomendations"} items={recommendations} state={props.state} />
      </ContentProduct>
    )
  }

}
