import React from 'react'
import async from 'async'

import {ContentStarred, BlockCollection, Scaffold} from '../../components/items'

import MetadataAdapter from '../../api/metadata/adapter'

import StarredPage from '../starred'

export default class StarredController extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      items: {},
      empty: false,
      isMounted: false
    }
  }

  componentDidMount() {
    const {props, state} = this
    const {starred} = props.state.saved

    let movies = []

    async.each(starred.movies, (tmdbId, next) => {
      MetadataAdapter.getMovieById(tmdbId)
        .then(movie => {
          movies.push(movie)
          next(null)
        })
        .catch(next)
    }, function(err) {
      console.log(movies)
    })

    /*if (countMovies || countShows) {
      async.parallel({
        movies: (done) => {
          let movies = []

          if (countMovies) {
            async.each(starred.movies, (tmdbId, next) => {
              MetadataAdapter.getMovieById(tmdbId)
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
        console.log(err, res)

        this.setState({
          isMounted: true
        })
      })
    } else {
      this.setState({
        empty: true,
        isMounted: true
      })
    }*/
  }

  render() {
    const {props, state} = this

    return state.isMounted ? (
      <ContentStarred>
        <BlockCollection classNames="empty-container starred-list"><Scaffold><div className="empty-content-icon"><span className="title">Stjernemærket</span><span className="text">Stjernemærk det, som du er interesseret i at se. Så har du altid en liste til rådighed, når du har lyst – på alle dine Viaplay-enheder!</span><div className="starred-list-icon"></div><span className="info">Du har ikke stjernemærket noget endnu.</span></div></Scaffold></BlockCollection>
      </ContentStarred>
    ) : (
      <div>Some loading content</div>
    )
  }

}
