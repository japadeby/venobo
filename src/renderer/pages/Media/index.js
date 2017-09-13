import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Loader } from '../../components/Items'
import MediaPage from './container'

import { mediaActions } from './redux'

@connect(
  state => ({ ...state.media }),
  { ...mediaActions }
)
export default class MediaController extends Component {

  componentWillReceiveProps(nextProps) {
    const { tmdb, type } = nextProps.match.params

    if (tmdb !== this.props.match.params.tmdb) {
      this.props.fetchData(tmdb, type)
    }
  }

  componentDidMount = () => {
    const { tmdb, type } = this.props.match.params

    this.props.fetchData(tmdb, type)
  }

  render() {
    const { props } = this

    return props.isReady ? (
      <MediaPage />
    ) : (
      <Loader spinner="dark" container="dark" />
    )
  }

}
