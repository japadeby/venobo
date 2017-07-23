import { NavLink } from 'react-router-dom'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'debounce'

import { withTranslate } from '../react-multilingual'
import * as searchActions from './redux/actions'
import Poster from '../Poster'
import {
  BlockCollection,
  ReactGrid,
  Scaffold,
  Loader
} from '../Items'

@connect(
  state => ({ ...state.search }),
  { ...searchActions }
)
class Search extends Component {

  static propTypes = {
    translate: PropTypes.func.isRequired,
    searchAction: PropTypes.func.isRequired,
    searchFilter: PropTypes.func.isRequired,
    filter: PropTypes.string.isRequired,
    results: PropTypes.object.isRequired,
    //resultsEmpty: PropTypes.oneOfType([null, PropTypes.bool]).isRequired,
    fetching: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired
  }

  prevQuery: String = null

  constructor(props) {
    super(props)

    this.debounceSearch = debounce(this.search, 1500)
  }

  search = () => {
    const searchQuery = this.refs.query.value

    if (searchQuery == this.prevQuery || searchQuery == '') return

    this.prevQuery = searchQuery

    this.props.searchAction(searchQuery)
  }

  setResultsFilter(filter, disabled) {
    const {props} = this

    if (props.filter !== filter && !disabled) {
      props.searchFilter(filter)
    }
    return false // prevent scrolling up
  }

  renderResultsFilters() {
    const { results, filter, resultsEmpty, fetching } = this.props

    return resultsEmpty === false && !fetching ? (
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

  render() {
    const { active, filter, results, resultsEmpty, fetching } = this.props

    return active ? (
      <div className="search-mount" style={{top: '66px'}}>
        <div className="search react-search">
          <div className="search-dim"></div>
          <div className="search-content">
            <div className="form-container">
              <span className="search-clear" onClick={() => $(this.refs.query).val('')}>Ryd</span>
              <input className="search-field" onKeyUp={this.debounceSearch} autoComplete="off" ref="query" placeholder="Søg på titel" />
            </div>
            {resultsEmpty === true && !fetching &&
              <div className="no-result">
                <div className="search-header">
                  <span className="search-header-strong"></span>
                  <span>Vi fik ingen hits på det, du søgte efter.</span>
                </div>
                <span className="search-help">Det kan skyldes, at vi ikke har det hos os, eller at det blev stavet lidt forkert. Tag et kig i <a href="http://kundeservice.viaplay.dk/?s=qweqweqwe">kundeservice</a>, og se om de ved mere.</span>
              </div>
            }
            <BlockCollection className="search-result portrait">
              {this.renderResultsFilters()}
              <Scaffold>
                {fetching && <Loader spinner="dark" container="light" />}
                {resultsEmpty === false && !fetching &&
                  <ReactGrid className="result">
                    <Poster items={results[filter]} />
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

export default withTranslate(Search)
