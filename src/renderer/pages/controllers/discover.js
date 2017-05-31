import React from 'react'
import async from 'async'
import {NavLink} from 'react-router-dom'
import randomString from 'crypto-random-string'
import classNames from 'classnames'
import debounce from 'debounce'

import MetadataAdapter from '../../api/metadata/adapter'

import {
  SectionMenu,
  ContentCategory,
  Scaffold,
  SectionWrapper,
  BlockCollection,
  ReactGrid,
  CollectionHeader
} from '../../components/items'
import Poster from '../../components/poster'

export default class DiscoverController extends React.Component {

  genres = {
    movies: {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western'
    },
    shows: {
      10759: 'Action & Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      10762: 'Kids',
      9648: 'Mystery',
      10763: 'News',
      10764: 'Reality',
      10765: 'Sci-Fi & Fantasy',
      10766: 'Soap',
      10767: 'Talk',
      10768: 'War & Politics',
      37: 'Western'
    }
  }

  sortBy = [
    'popularity.desc',
    'release_date.desc',
    'vote_count.desc',
    'original_title.desc'
  ]

  initialState = {
    navDockable: false,
    isMounted: false,
    isFetching: true,
    items: [],
    page: 1,
    lastScrollTop: 0
  }

  isFetching: Boolean = true
  lastScrollTop: Number = 0

  constructor(props) {
    super(props)

    this.debounceOnScroll = debounce(this.onScroll, 100)

    this.state = {
      ...this.initialState,
      params: props.match.params
    }
  }

  componentWillReceiveProps(nextProps) {
    window.scrollTo(0, 0)

    // reset
    this.isFetching = true
    this.lastScrollTop = 0

    this.setState({
      ...this.initialState,
      params: nextProps.match.params
    }, () => this.setData())
  }

  componentWillUnmount() {
    $('#content-wrapper').off('scroll', this.onScroll)
  }

  onScroll = () => {
    const {navDockable, isFetching} = this.state
    const {scrollTop, scrollHeight} = $('#content-wrapper')[0]

    if (scrollTop > this.lastScrollTop) {
      if (scrollTop >= (scrollHeight - $(window).height() - 250)) {
        if (!this.isFetching) this.setData()
      }
      this.lastScrollTop = scrollTop
    }

    if (scrollTop >= 66) {
      if (!navDockable) this.setState({navDockable: true})
    } else {
      if (navDockable) this.setState({navDockable: false})
    }

    /*if($('#content-wrapper')[0].scrollHeight === $('#content-wrapper').scrollTop() + $(window).height()) {
      console.log('infiniteScroll')
      if (!isFetching) this.setData()
    }*/
  }

  componentDidMount() {
    $('#content-wrapper').on('scroll', this.onScroll)

    this.setData()
  }

  setData() {
    const {params} = this.state

    if (params.sortBy) {
      let {page, items} = this.state
      var itemsCount = 0

      this.isFetching = true

      async.whilst(
        function() { return itemsCount < 20 },
        function(done) {
          MetadataAdapter.discover(params.type, {
            page,
            sort_by: params.sortBy,
            with_genres: params.genre !== 'all'
              ? params.genre
              : ''
          })
          .then(data => {
            console.log(page)
            page++
            itemsCount += data.length
            done(null, items = items.concat(data))
          })
          .catch(() =>  {
            page++
            done()
          })
        }, (err, data) => {
          this.isFetching = false

          this.setState({
            page,
            items: data,
            isMounted: true
          })
        }
      )
    } else {
      this.setState({
        isFetching: false,
        isMounted: true
      })
    }
  }

  categoriesHover = () => {
    $(this.refs.categories).addClass('active-hover')
  }

  categoriesLeave = () => {
    $(this.refs.categories).removeClass('active-hover')
  }

  receiveNav() {
    let {genres, sortBy, state, props} = this
    const {translate} = props
    const {params} = state

    genres = genres[params.type]
    const genresLength = Object.keys(genres).length

    return (
      <SectionMenu>
      	<div className="dock">
      		<SectionWrapper>
      			<Scaffold classNames="inner">
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
                                <li key={randomString(5)}>
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
                                <li key={randomString(5)}>
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
                        <li key={randomString(5)} className={isActive}>
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
    const {navDockable, isMounted, items} = this.state
    const {genre, sortBy, type} = this.props.match.params

    return isMounted ? (
      <ContentCategory>
        <div className="dockable" ref="dockable">
          {navDockable ? this.receiveNav() : ''}
        </div>
        {!navDockable ? this.receiveNav() : (<div style={{height: '66px'}}></div>)}
        {items.length !== 0 &&
          <BlockCollection classNames="portrait">
            <Scaffold>
              <CollectionHeader>
                <h2>{this.genres[type][genre]} sorted by {sortBy}</h2>
              </CollectionHeader>
              <ReactGrid>
                <Poster key={randomString(5)} items={items} state={this.props.state} />
              </ReactGrid>
            </Scaffold>
          </BlockCollection>
        }
      </ContentCategory>
    ) : (<div></div>)
  }

}
