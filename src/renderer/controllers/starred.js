import React from 'react'
import async from 'async'

import {ContentStarred, BlockCollection, Scaffold} from '../components/items'

import MetaDataProvider from '../api/metadata'

import StarredPage from '../pages/starred'

export default class StarredController extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      items: {},
      empty: false,
      isMounted: false
    }
  }

  componentWillMount() {
    const {props, state} = this
    const {starred} = props.state.saved

    if (state.isMounted) return

    const countMovies = starred.movies.length
    const countShows = starred.shows.length

    if (countMovies || countShows) {
      async.parallel({
        movies: (done) => {
          let movies = []

          if (countMovies) {
            async.each(starred.movies, (tmdbId, next) => {
              MetaDataProvider.getMovieById(tmdbId)
                .then(movie => {
                  movies.push(movie)
                  next()
                })
                .catch(next)
            }, function(err) {
              done(err, movies)
            })
          } else {
            done(null, movies)
          }
        },
        shows: (done) => done()
      }, (err, res) => {
        console.log(res)

        this.setState({
          isMounted: true
        })
      })
    } else {
      this.setState({
        empty: true,
        isMounted: true
      })
    }
  }

  render() {
    const {props, state} = this

    if (state.isMounted) {
      return (
        <ContentStarred>
          <BlockCollection classNames="empty-container starred-list"><Scaffold><div className="empty-content-icon"><span className="title">Stjernemærket</span><span className="text">Stjernemærk det, som du er interesseret i at se. Så har du altid en liste til rådighed, når du har lyst – på alle dine Viaplay-enheder!</span><div className="starred-list-icon"></div><span className="info">Du har ikke stjernemærket noget endnu.</span></div></Scaffold></BlockCollection>
        </ContentStarred>
      )
    } else {
      return (<div>Some loading content</div>)
    }
  }

}
