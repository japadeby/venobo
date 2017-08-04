import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  Scaffold,
  CollectionHeader,
  BlockCollection,
  HeaderButton,
  ReactGrid
} from '../../components/Items'
import { Poster } from '../../components'

@connect(state => ({ ...state.starred }))
export default class StarredPage extends Component {

  render () {
    const { items } = this.props

    const shouldRenderMovies = items.movies.length !== 0
    const shouldRenderShows = items.shows.length !== 0

    return shouldRenderMovies || shouldRenderShows ? (
      <BlockCollection className="portrait">
        <Scaffold>
          {shouldRenderMovies &&
            <section>
              <CollectionHeader>
                {/*<HeaderButton>Unstar all</HeaderButton>*/}
                <h2>Movies</h2>
              </CollectionHeader>
              <ReactGrid>
                <Poster items={items.movies} />
              </ReactGrid>
            </section>
          }
          {shouldRenderShows &&
            <section>
              <CollectionHeader>
                {/*<HeaderButton>Unstar all</HeaderButton>*/}
                <h2>Shows</h2>
              </CollectionHeader>
              <ReactGrid>
                <Poster items={items.shows} />
              </ReactGrid>
            </section>
          }
        </Scaffold>
      </BlockCollection>
    ) : (
      <BlockCollection className="empty-container starred-list">
        <Scaffold>
          <div className="empty-content-icon">
            <span className="title">Stjernemærket</span>
            <span className="text">Stjernemærk det, som du er interesseret i at se. Så har du altid en liste til rådighed, når du har lyst – på alle dine Viaplay-enheder!</span>
            <div className="starred-list-icon"></div>
            <span className="info">Du har ikke stjernemærket noget endnu.</span>
          </div>
        </Scaffold>
      </BlockCollection>
    )
  }

}
