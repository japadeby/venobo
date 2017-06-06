import React from 'react'
import debounce from 'debounce'
import {NavLink} from 'react-router-dom'
import classNames from 'classnames'
import randomString from 'crypto-random-string'

import {
  BlockCollection,
  ReactGrid,
  Scaffold,
  Loader
} from './items'
import Poster from './poster'
import MetadataAdapter from '../api/metadata/adapter'
import {withTranslate} from './react-multilingual'

class SearchMount extends React.Component {

  initialState = {
    results: {
      all: [],
      movies: [],
      shows: []
    },
    loading: false,
    filter: 'all'
  }

  prevQuery: String = null

  constructor(props) {
    super(props)

    props.state.search.mount = this.toggle
    this.debounceSearch = debounce(this.search, 1500)

    this.state = {
      resultsEmpty: null,
      active: false,
      ...this.initialState
    }
  }

  search = () => {
    const searchQuery = this.refs.query.value
    const {loading} = this.state

    if (searchQuery == this.prevQuery || searchQuery == '') return

    this.prevQuery = searchQuery

    if (!loading) this.setState({ loading: true })

    MetadataAdapter.quickSearch(searchQuery)
      .then(res => {
        const results = {
          all: res,
          movies: res.filter(
            media => media.type == 'movie'
          ),
          shows: res.filter(
            media => media.type == 'show'
          )
        }

        this.setState({
          results,
          filter: 'all',
          resultsEmpty: false,
          loading: false
        })
      })
      .catch(err => this.setState({
        resultsEmpty: true,
        ...this.initialState
      }))
  }

  setResultsFilter(filter, disabled) {
    if (this.state.filter !== filter && !disabled) {
      this.setState({filter})
    }
  }

  renderResultsFilters() {
    const {results, filter, resultsEmpty, loading} = this.state

    return resultsEmpty === false && !loading ? (
      <div className="search-filters">
        <ul className="filters">
          {Object.keys(results).map(type => {
            const disabled = results[type].length === 0
            const className = classNames({
              active: filter === type,
              disabled
            })

            return (
              <li className={className} key={type}>
                <a href="#" onClick={() => this.setResultsFilter(type, disabled)}>{type}</a>
              </li>
            )
          })}
        </ul>
      </div>
    ) : (<div></div>)
  }

  toggle = () => {
    const {props, state} = this

    props.state.search.enabled = !state.active
    this.setState({ active: !state.active })
  }

  render() {
    const {state, props} = this
    const {filter, results, resultsEmpty, loading} = state

    return state.active ? (
      <div className="search-mount" style={{top: '66px'}}>
        <div className="search react-search">
          <div className="search-dim"></div>
          <div className="search-content">
            <div className="form-container">
              <span className="search-clear" onClick={() => $(this.refs.query).val('')}>Ryd</span>
              <input className="search-field" onKeyUp={this.debounceSearch} autoComplete="off" ref="query" placeholder="Søg på titel" />
            </div>
            {resultsEmpty === true && !loading &&
              <div className="no-result">
                <div className="search-header">
                  <span className="search-header-strong"></span>
                  <span>Vi fik ingen hits på det, du søgte efter.</span>
                </div>
                <span className="search-help">Det kan skyldes, at vi ikke har det hos os, eller at det blev stavet lidt forkert. Tag et kig i <a href="http://kundeservice.viaplay.dk/?s=qweqweqwe">kundeservice</a>, og se om de ved mere.</span>
              </div>
            }
            <BlockCollection classNames="search-result portrait">
              {this.renderResultsFilters()}
              <Scaffold>
                {loading && <Loader spinner="dark" container="light" />}
                {resultsEmpty === false && !loading &&
                  <ReactGrid classNames="result">
                    <Poster key={randomString(5)} items={results[filter]} state={props.state} />
                  </ReactGrid>
                }
              </Scaffold>
            </BlockCollection>
          </div>
        </div>
      </div>
    ) : (
      <div></div>
    )
  }

}

export default withTranslate(SearchMount)
