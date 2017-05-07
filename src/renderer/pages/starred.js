import React from 'react'

import {
  Scaffold,
  CollectionHeader,
  BlockCollection,
  HeaderButton,
  ReactGrid
} from '../components/items'
import Poster from '../components/poster'

export default class Starred extends React.Component {
  componentWillMount () {

  }

  render () {
    var items = {
      1: {
        poster: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/e2vftpMeRCvj4uHPlYiznLWodT8.jpg'
      },
      2: {
        poster: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/4PiiNGXj1KENTmCBHeN6Mskj2Fq.jpg'
      },
      3: {
        poster: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/iNpz2DgTsTMPaDRZq2tnbqjL2vF.jpg'
      },
      4: {
        poster: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/g1kHEZgI0ezrvJWOtZeWliamjFS.jpg'
      },
      5: {
        poster: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/myRzRzCxdfUWjkJWgpHHZ1oGkJd.jpg'
      },
      6: {
        poster: 'https://image.tmdb.org/t/p/w300_and_h450_bestv2/bndiUFfJxNd2fYx8XO610L9a07m.jpg'
      },
      7: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      },
      8: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315'
      },
      9: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      },
      10: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315'
      },
      11: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      },
      12: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315'
      },
      13: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      },
      30: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      },
      14: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315'
      },
      15: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      },
      16: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315'
      },
      17: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      },
      18: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315'
      },
      19: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      },
      20: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315'
      },
      21: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      },
      22: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315'
      },
      23: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      },
      24: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315'
      },
      25: {
        poster: 'https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315'
      }
    }
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
