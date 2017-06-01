import React from 'react'
import randomString from 'crypto-random-string'
import classNames from 'classnames'
import {Link} from 'react-router-dom'

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

    this.state = {
      pagination: 1,
      episodes: '',
      navigation: ''
    }
  }

  renderNavigation(pagination) {
    const {media} = this.props.data
    const seasons = media.season_episodes

    return Object.keys(seasons).map(season => {
      const active = classNames({
        active: pagination == season
      })
      return (
        <a href="#" className={active} data-season={season} key={season} onClick={this.paginate}>{season}</a>
      )
    })
  }

  paginate = (e) => {
    const {pagination} = this.state.pagination
    const season = Number($(e.target).data('season'))

    if (season !== pagination) {
      this.setState({
        pagination: season,
        navigation: this.renderNavigation(season),
        episodes: this.renderEpisodes(season)
      })
    }

    e.preventDefault()
  }

  renderEpisodes(season) {
    const {data, history} = this.props
    const {media} = data
    const episodes = media.season_episodes[season]

    return Object.keys(episodes).map(episode => {
      const {poster, title, summary, voted, votes, torrents} = episodes[episode]
      return (
        <div className="episode table" key={randomString(5)} onClick={() => history.push(`/player/show/${media.tmdb}/${season}/${episode}`)}>
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
              {/*<span className="episode-length">57min</span>*/}
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
        </div>
      )
    })
  }

  componentDidMount() {
    const {state, props} = this
    const {type} = props.data.media
    const {pagination} = state

    if (type === 'show') {
      this.setState({
        episodes: this.renderEpisodes(pagination),
        navigation: this.renderNavigation(pagination)
      })
    }
  }

  render() {
    const {props, state} = this
    const {similar, media, recommended} = props.data

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
              {media.type === 'movie' &&
                <PlayerWrapper />
              }
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
                  <StarredIcon data={media} state={props.state} />
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
            <section className="block season landscape">
              <Scaffold>
                <div className="episodes" ref="episodes">
                  {state.episodes}
                </div>
              </Scaffold>
            </section>
          </div>
        }
        {similar.length !== 0 &&
          <Carousel title={"Lignende film"} items={similar} state={props.state} />}
        {recommended.length !== 0 &&
          <Carousel title={"Recomendations"} items={recommended} state={props.state} />}
      </ContentProduct>
    )
  }

}
