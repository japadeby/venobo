import React from 'react'
import async from 'async'
import randomString from 'crypto-random-string'

import {
  ContentStarred,
  BlockCollection,
  Scaffold,
  Loader
} from '../../components/items'

import MetadataAdapter from '../../api/metadata/adapter'

import StarredPage from '../starred'

export default class StarredController extends React.Component {

  initialState = {
    items: {
      movies: [],
      shows: []
    },
    isMounted: false
  }

  constructor(props) {
    super(props)

    this.state = this.initialState
  }

  onUnstar = (type, tmdb) => {
    var {items} = this.state

    items[type] = items[type].filter(
      media => media.tmdb !== tmdb
    )

    console.log('unStar')

    this.props.state.tooltip.toggle()

    this.setState({ ...items })
  }

  get(type, done) {
    const {starred} = this.props.state.saved

    const method = type === 'shows'
      ? 'checkShow'
      : 'getMovieById'

    var media = []

    async.each(starred[type], (tmdbId, next) => {
      MetadataAdapter[method].call(MetadataAdapter, tmdbId)
        .then(metadata => {
          media.push(metadata)
          next(null)
        })
        .catch(next)
    }, function (err) {
      done(err, media)
    })
  }

  componentWillUnmount() {
    this.props.state.starredAction = undefined
  }

  componentDidMount() {
    const {props, state} = this
    const {starred} = props.state.saved

    props.state.starredAction = this.onUnstar

    if (starred.movies || starred.shows) {
      async.parallel({
        movies: (done) => this.get('movies', done),
        shows: (done) => this.get('shows', done)
      }, (err, items) => {
        this.setState({
          isMounted: true,
          items
        })
      })
    } else {
      this.setState({ isMounted: true })
    }
  }

  render() {
    const {props, state} = this

    return state.isMounted ? (
        <ContentStarred>
          <StarredPage key={randomString(5)} {...props} items={state.items} />
        </ContentStarred>
      ) : (
      <Loader spinner="dark" container="dark" />
    )
  }

}
