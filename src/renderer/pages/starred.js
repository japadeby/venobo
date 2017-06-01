import React from 'react'
import randomString from 'crypto-random-string'

import {
  Scaffold,
  CollectionHeader,
  BlockCollection,
  HeaderButton,
  ReactGrid
} from '../components/items'
import Poster from '../components/poster'

export default class StarredPage extends React.Component {

  constructor(props) {
    super(props)
  }

  render () {
    const {props} = this
    const {items, state} = props

    const shouldRenderMovies = items.movies.length !== 0
    const shouldRenderShows = items.shows.length !== 0

    return shouldRenderMovies || shouldRenderShows ? (
      <BlockCollection classNames="portrait">
        <Scaffold>
          {shouldRenderMovies &&
            <section>
              <CollectionHeader>
                {/*<HeaderButton>Unstar all</HeaderButton>*/}
                <h2>Movies</h2>
              </CollectionHeader>
              <ReactGrid>
                <Poster key={randomString(5)} items={items.movies} state={state} />
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
                <Poster key={randomString(5)} items={items.shows} state={state} />
              </ReactGrid>
            </section>
          }
        </Scaffold>
      </BlockCollection>
    ) : (
      <BlockCollection classNames="empty-container starred-list">
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
