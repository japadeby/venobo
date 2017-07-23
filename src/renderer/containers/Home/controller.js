import React, { Component } from 'react'
import { connect } from 'react-redux'

import { ContentSection, Loader } from '../../components/Items'
import HomeContainer from './container'

import { homeActions } from './redux'

@connect(
  state => ({ ...state.home }),
  { ...homeActions }
)
export default class HomeController extends Component {

  componentDidMount = () => this.props.fetchMedia()

  render() {
    const { props } = this

    return props.isReady ? (
      <ContentSection>
        <HomeContainer {...props} />
      </ContentSection>
    ) : (
      <Loader spinner="dark" container="dark" top="250px" />
    )
  }

}
