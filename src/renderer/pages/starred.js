import React from 'react'

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
    return (
      <BlockCollection>
        <Scaffold>
          <CollectionHeader>
            <HeaderButton>Unstar all</HeaderButton>
            <h2>Movies</h2>
          </CollectionHeader>
          <ReactGrid>
            <Poster items={items} />
          </ReactGrid>
        </Scaffold>
      </BlockCollection>
    )
  }
}
