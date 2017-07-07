import React, { Component } from 'react'

import { ContentSection, Loader } from '../../components/items'
import HomeContainer from './container'
import { homeActions } from './redux'

@connect(
  state => ({ home: ...state.home }),
  { ...homeActions }
)
export default class HomeController extends Component {

  componentDidMount() {
    this.props.fetchMedia()
  }

  render() {
    const { props } = this

    return props.isReady ? (
      <ContentSection>
        <HomeContainer media={props.media} />
      </ContentSection>
    ) : (
      <Loader spinner="dark" container="dark" top="250px" />
    )
  }

}
