import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { provideHooks } from 'redial'
import { Link } from 'react-router-dom'

import {
  ContentProduct,
  Hero,
  MovieProduct,
  HeroWrapper,
  PlayerWrapper,
  Scaffold
} from '../../components/Items'
import { Carousel, StarredIcon } from '../../components'

import { mediaActions } from './redux'

@provideHooks({
  defer: ({ store: { dispatch }, match: { params: { tmdb, type } } }) => {
    return dispatch(mediaActions.fetch(tmdb, type))
  }
})
@connect(
  state => ({
    app: state.app,
    state: state.media
  }),
  mediaActions
)
export default class MediaPage extends Component {

  componentWillReceiveProps(nextProps) {
    const { tmdb, type } = nextProps.match.params

    if (tmdb !== this.props.match.params.tmdb) {
      this.props.fetch(tmdb, type)
    }
  }

  renderNavigation(pagination: Number) {
    const { media } = this.props.state.data
    const seasons = media.season_episodes

    return Object.keys(seasons).map(season => {
      const active = classNames({ active: pagination == season })

      return (
        <a href="#" className={active} data-season={season} key={season} onClick={this.paginate}>{season}</a>
      )
    })
  }

  paginate = (e) => {
    const { pagination } = this.props.state
    const season = Number($(e.target).data('season'))

    if (season !== pagination) {
      this.props.paginate({
        pagination: season,
        navigation: this.renderNavigation(season),
        episodes: this.renderEpisodes(season)
      })
    }

    e.preventDefault()
  }

  renderEpisodes(season: Number) {
    const { media } = this.props.state.data
    const episodes = media.season_episodes[season]

    return Object.keys(episodes).map(episode => {
      const {poster, title, summary, voted, votes, torrents} = episodes[episode]
      return (
        <div className="react-item episode" key={episode}>
          <div className="front">
            <div className="front-image" style={{
              backgroundImage: `url(${poster})`
            }}></div>
            <div className="backdrop medium">
              <div className="react-play-button fill">
                <figure className="icon-content"></figure>
              </div>
            </div>
            <div className="episode-labels episode-progress">
              <div className="title">{episode}. {title}</div>
            </div>
            <progress max="100" value="100" />
          </div>
          <span className="flags">
            {Object.keys(torrents).map(quality => (
              <span className="flag" key={quality}>{quality}</span>
            ))}
          </span>
          <div className="duration">
            10m
          </div>
          <div className="synopsis">{summary}</div>
        </div>
      )
    })

    /*<div className="episode table" key={episode}>
      <Link to={`/player/show/${media.tmdb}/${season}/${episode}`}>
        <div className="front">
          <div>
            <h3>
              <a className="episode-link">
                <div className="front-image episode-img" style={{background: `url(${poster}) no-repeat center center`}}></div>
              </a>
            </h3>
            <div className="backdrop small">
              <div className="box">
                <div className="play-link"></div>
                <div className="load-spinner dark small"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="meta-data-container">
          <div className="meta">
            <span className="title">{episode}. {title}</span>
            &nbsp;&nbsp;&nbsp;
            <span className="flags">
              {Object.keys(torrents).map(quality => {
                return (
                  <span className="flag" key={quality}>{quality}</span>
                )
              })}
            </span>
          </div>
          <div className="table">
            <div className="synopsis">
              <span>{summary}</span>
            </div>
            <div className="progress">
              <progress value="99" max="100">99% </progress>
              <p className="remaining">0 minutter tilbage</p>
            </div>
            <div className="starred">
              <a className="icon starred"></a>
            </div>
          </div>
        </div>
      </Link>
    </div>*/
  }

  componentDidMount() {
    if (this.props.state.data.media.type === 'show') {
      const season = 1

      this.props.paginate({
        pagination: season,
        episodes: this.renderEpisodes(season),
        navigation: this.renderNavigation(season)
      })
    }
  }

  render() {
    const { state, app } = this.props
    const { similar, media, recommended } = state.data

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
              {/*media.type === 'movie' &&
                <PlayerWrapper onClick={() => props.history.push(`/player/movie/${media.tmdb}/${defaultQuality}`)} />
              */}
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
                  <StarredIcon data={media} state={app} />
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
              <span className="label">Season</span>
              <div className="tabs" ref="pagination">
                {state.navigation}
              </div>
            </Scaffold>
          </div>
          <Scaffold>
            <section className="block collection landscape episode">
              <div className="react-grid">
                {state.episodes}
              </div>
            </section>
          </Scaffold>
        </div>
        }
        {similar.length !== 0 &&
        <Carousel title={"Lignende film"} items={similar} />}
        {recommended.length !== 0 &&
        <Carousel title={"Recommendations"} items={recommended} />}
      </ContentProduct>
    )
  }

}
