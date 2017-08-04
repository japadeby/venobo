import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import config from '../../../config'

import {
  Loader,
  SectionMenu,
  ContentCategory,
  Scaffold,
  SectionWrapper,
  BlockCollection,
  ReactGrid,
  CollectionHeader
} from '../../components/Items'
import { Poster } from '../../components'

import { discoverActions } from './redux'

@connect(
  state => ({ ...state.discover }),
  { ...discoverActions }
)
export default class DiscoverController extends Component {

  componentWillReceiveProps(nextProps) {
    window.scrollTo(0, 0)

    const {params} = nextProps.match

    // reset
    //this.isFetching = false
    this.lastScrollTop = 0

    if (params.genre !== this.props.match.params.genre) {
      this.props.setData(params, true)
    }
  }

  componentWillUnmount() {
    $('#content-wrapper').off('scroll', this.onScroll)
  }

  onScroll = () => {
    const {navDockable} = this.props
    const {scrollTop, scrollHeight} = $('#content-wrapper')[0]

    if (scrollTop > this.lastScrollTop) {
      if (scrollTop >= (scrollHeight - $(window).height() - 250)) {
        this.props.setData(this.props.match.params)
      }
      this.lastScrollTop = scrollTop
    }

    if (scrollTop >= 66) {
      if (!navDockable) this.props.toggleDock()
    } else {
      if (navDockable) this.props.dismissDock()
    }

    /*if($('#content-wrapper')[0].scrollHeight === $('#content-wrapper').scrollTop() + $(window).height()) {
      console.log('infiniteScroll')
      if (!isFetching) this.setData()
    }*/
  }

  componentDidMount() {
    $('#content-wrapper').on('scroll', this.onScroll)

    this.props.setData(this.props.match.params)
  }

  categoriesHover = () => {
    $(this.refs.categories).addClass('active-hover')
  }

  categoriesLeave = () => {
    $(this.refs.categories).removeClass('active-hover')
  }

  receiveNav() {
    const {translate} = this.props
    const {params} = this.props.match

    const sortBy = config.TMDB.SORT_BY
    const genres = config.TMDB.GENRES[params.type.toUpperCase()]
    const genresLength = Object.keys(genres).length

    return (
      <SectionMenu>
      	<div className="dock">
      		<SectionWrapper>
      			<Scaffold className="inner">
      				<div className="details categories" onMouseEnter={this.categoriesHover} onMouseLeave={this.categoriesLeave} ref="categories">
      						<div className="summary">
      							<button>
      								{genres[params.genre] ? genres[params.genre] : params.genre === 'all' ? 'Alle film' : 'Vælg kategori' /*translate(`nav.genres.${genres[params.genre]}`)*/}
      							</button>
      						</div>
      						<div className="dropdown">
      							<div className="box-shadow">
      								<div className="category-groups">
      										<ul className="group">
      											<li><strong>Genres</strong></li>
                            {Object.keys(genres).slice(0, genresLength / 2).map(id => {
                              const name = genres[id]
                              return (
                                <li key={id}>
                                  <NavLink to={`/discover/${params.type}/${id}/popularity.desc`}>
                                    {name/*translate(`nav.genres.${name.toLowerCase()}`)*/}
                                  </NavLink>
                                </li>
                              )
                            })}
                          </ul>
      										<ul className="group">
      											<li><strong>More genres</strong></li>
                            {Object.keys(genres).slice(genresLength / 2, genresLength).map(id => {
                              const name = genres[id]
                              return (
                                <li key={id}>
                                  <NavLink to={`/discover/${params.type}/${id}/popularity.desc`}>
                                    {name/*translate(`nav.genres.${name.toLowerCase()}`)*/}
                                  </NavLink>
                                </li>
                              )
                            })}
      										</ul>
      								</div>
      								<div className="footer">
      									<NavLink to={`/discover/${params.type}/all/popularity.desc`}>Alle film</NavLink>
      								</div>
      							</div>
      						</div>
      				</div>
              {params.genre &&
        				 <div className="align-right">
        					<ul className="sortby">
                    {sortBy.map(key => {
                      const isActive = classNames({active: key === params.sortBy})

                      return (
                        <li key={key} className={isActive}>
            							<NavLink to={`/discover/${params.type}/${params.genre}/${key}`}>{key}</NavLink>
                        </li>
                      )
                    })}
        					</ul>
        				</div>
              }
      			</Scaffold>
      		</SectionWrapper>
      	</div>
      </SectionMenu>
    )
  }

  render() {
    const {navDockable, isReady, items, fetching} = this.props
    const {genre, sortBy, type} = this.props.match.params

    return isReady ? (
      <ContentCategory>
        <div className="dockable" ref="dockable">
          {navDockable ? this.receiveNav() : ''}
        </div>
        {!navDockable ? this.receiveNav() : (<div style={{height: '66px'}}></div>)}
        {items &&
          <BlockCollection className="portrait">
            <Scaffold>
              <CollectionHeader>
                <h2>{config.TMDB.GENRES[type.toUpperCase()][genre]} sorted by {sortBy}</h2>
              </CollectionHeader>
              <ReactGrid>
                <Poster key={items.length} items={items} />
              </ReactGrid>
              {fetching && <Loader spinner="dark" container="dark" top="45px" bottom="15px" />}
            </Scaffold>
          </BlockCollection>
        }
      </ContentCategory>
    ) : (
      <Loader spinner="dark" container="dark" top="250px" />
    )
  }

}
