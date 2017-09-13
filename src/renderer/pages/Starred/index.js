import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Loader, ContentStarred } from '../../components/Items'
import StarredPage from './container'

import { starredActions } from './redux'

@connect(
  state => ({ ...state.starred }),
  { ...starredActions }
)
export default class StarredController extends Component {

  componentDidMount = () => this.props.fetchStarred()

  render() {
    const { props } = this

    return props.isReady ? (
        <ContentStarred>
          <StarredPage {...props} />
        </ContentStarred>
      ) : (
        <Loader spinner="dark" container="dark" />
      )
  }

}
