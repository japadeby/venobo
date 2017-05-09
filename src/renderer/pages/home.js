/**
 * Venobo App
 *
 * @author Marcus S. Abildskov
 */

import React from 'react'

import Carousel from '../components/carousel'

export default class HomePage extends React.Component {

  constructor(props) {
    super(props)
  }

  categoriesHover = () => {
    $(this.refs.categories).addClass('active-hover')
  }

  categoriesLeave = () => {
    $(this.refs.categories).removeClass('active-hover')
  }

  render() {
    const { props } = this

    return (
      <div>
        <nav className="block section-menu active">
          <div className="dock">
            <div className="section-wrapper">
              <div className="scaffold inner">
                <div className="details categories" onMouseEnter={this.categoriesHover} onMouseLeave={this.categoriesLeave} ref="categories">
                  <div className="summary">
                    <button style={{cursor: 'pointer', WebkitUserSelect: 'none'}}>Choose category</button>
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
        <Carousel title={"Latest movies added"} route={"/movies/latest"} items={props.media.movies} state={props.state} />
      </div>
    )
  }

}
