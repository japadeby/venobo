/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import React from 'react'

import Carousel from './carousel'

export default class Home extends React.Component {

  componentWillMount() {
    document.title = "Venobo Home"
  }

  categoriesHover = () => {
    $(this.refs.categories).addClass('active-hover')
  }

  categoriesLeave = () => {
    $(this.refs.categories).removeClass('active-hover')
  }

  render() {
    var items = {
      1: {
        poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/e2vftpMeRCvj4uHPlYiznLWodT8.jpg"
      },
      2: {
        poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/4PiiNGXj1KENTmCBHeN6Mskj2Fq.jpg"
      },
      3: {
        poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/iNpz2DgTsTMPaDRZq2tnbqjL2vF.jpg"
      },
      4: {
        poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/g1kHEZgI0ezrvJWOtZeWliamjFS.jpg"
      },
      5: {
        poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/myRzRzCxdfUWjkJWgpHHZ1oGkJd.jpg"
      },
      6: {
        poster: "https://image.tmdb.org/t/p/w300_and_h450_bestv2/bndiUFfJxNd2fYx8XO610L9a07m.jpg"
      },
      7: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      },
      8: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315"
      },
      9: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      },
      10: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315"
      },
      11: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      },
      12: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315"
      },
      13: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      }
    }
    var items2 = {
      13: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      },
      14: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315"
      },
      15: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      },
      16: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315"
      },
      17: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      },
      18: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315"
      },
      19: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      },
      20: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315"
      },
      21: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      },
      22: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315"
      },
      23: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      },
      24: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/807/144/1487152119-edc59f1def6461c12b134792f068e6a7c0958241.jpg?width=210&height=315"
      },
      25: {
        poster: "https://i-viaplay-com.akamaized.net/scandi/Viaplay_Prod_-_Scandi/751/76/1472581711-dcaa0f5082937a192b25f4bee27e0c53c9bfc62e.jpg?width=210&height=315"
      }
    }
    return (
      <div>
        <nav className="block section-menu active">
          <div className="dock">
            <div className="section-wrapper">
              <div className="scaffold inner">
                <div className="details categories" onMouseEnter={this.categoriesHover} onMouseLeave={this.categoriesLeave} ref="categories">
                  <div className="summary">
                    <button>Choose category</button>
                  </div>
                  <div className="dropdown">
                    <div className="box-shadow">
                      <div className="category-groups">
                          <ul className="group">
                            <li><strong>Genrer</strong></li>
                            <li><a href="/film/action" data-href="https://content.viaplay.dk/pcdash-dk/film/action">Action</a></li>
                            <li><a href="/film/boernefilm" data-href="https://content.viaplay.dk/pcdash-dk/film/boernefilm">Børnefilm</a></li>
                            <li><a href="/film/dokumentar" data-href="https://content.viaplay.dk/pcdash-dk/film/dokumentar">Dokumentar</a></li>
                            <li><a href="/film/drama" data-href="https://content.viaplay.dk/pcdash-dk/film/drama">Drama</a></li>
                            <li><a href="/film/familiefilm" data-href="https://content.viaplay.dk/pcdash-dk/film/familiefilm">Familiefilm</a></li>
                            <li><a href="/film/gys" data-href="https://content.viaplay.dk/pcdash-dk/film/gys">Gys</a></li>
                            <li><a href="/film/klassiker" data-href="https://content.viaplay.dk/pcdash-dk/film/klassiker">Klassiker</a></li>
                            <li><a href="/film/komedie" data-href="https://content.viaplay.dk/pcdash-dk/film/komedie">Komedie</a></li>
                            <li><a href="/film/nordisk" data-href="https://content.viaplay.dk/pcdash-dk/film/nordisk">Nordisk</a></li>
                            <li><a href="/film/romantik" data-href="https://content.viaplay.dk/pcdash-dk/film/romantik">Romantik</a></li>
                            <li><a href="/film/science-fiction" data-href="https://content.viaplay.dk/pcdash-dk/film/science-fiction">Science fiction</a></li>
                            <li><a href="/film/sportsdokumentar" data-href="https://content.viaplay.dk/pcdash-dk/film/sportsdokumentar">Sportsdokumentar</a></li>
                            <li><a href="/film/thriller" data-href="https://content.viaplay.dk/pcdash-dk/film/thriller">Thriller</a></li>
                          </ul>
                          <ul className="group">
                            <li><strong>Temaer</strong></li>
                            <li><a href="/film/blockbusters" data-href="https://content.viaplay.dk/pcdash-dk/film/blockbusters">Blockbusters</a></li>
                            <li><a href="/film/disney" data-href="https://content.viaplay.dk/pcdash-dk/film/disney">Disney Movies on Demand</a></li>
                            <li><a href="/film/anmelderrost" data-href="https://content.viaplay.dk/pcdash-dk/film/anmelderrost">Anmelderrost</a></li>
                          </ul>
                      </div>
                      <div className="footer">
                        <a href="/film/alle" data-href="https://content.viaplay.dk/pcdash-dk/film/alle">Alle film</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="align-right">
                </div>
              </div>
            </div>
          </div>
        </nav>
        <Carousel title={"Newest releases"} route={"/newest"} items={items} />
        <Carousel title={"Most watched"} route={"/views"} items={items2} />
      </div>
    )
  }

}
