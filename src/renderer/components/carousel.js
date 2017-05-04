import React from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'
import md5 from 'crypto-js/md5'

import { withTranslate } from '../react-multilingual'
import Poster from './poster'
import {
  Scaffold,
  BlockCollection,
  CollectionHeader,
  HeaderButton
} from './items'

class Carousel extends React.Component {

    constructor(props) {
      super(props)

      this.state = {
        navPrevDisabled: true
      }
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.updateCarousel, false)
    }

    updateCarousel = () => {
      var state = this.state
      var $reactItems = $(this.refs.items).children().children('.react-item')
      var maxw = $(this.refs.wrapper).width()

      var itemsFitSlide = $reactItems.filter(function() {
        return $(this).position().left < maxw
      }).length

      var startPoint = parseInt($reactItems.css('margin-left'))

      this.setState({
        navPrevDisabled: true,
        innerWidth: -startPoint,
        startPoint: -startPoint,
        itemsShownTotal: itemsFitSlide,
        itemWidth: $reactItems.outerWidth(true),
        navNextDisabled: (itemsFitSlide === $reactItems.length),
        itemsLength: $reactItems.length,
        itemsFitSlide: itemsFitSlide
      })
    }

    componentDidMount() {
      this.updateCarousel()
      window.addEventListener("resize", this.updateCarousel, false)
    }

    handleNext = (e) => {
      var state = this.state

      var innerWidth = -Math.abs(state.innerWidth - (state.itemWidth * state.itemsFitSlide))

      var itemsLeft = state.itemsLength - state.itemsShownTotal
      var lastSlide = state.itemsFitSlide > itemsLeft

      if(lastSlide) {
        innerWidth = -Math.abs(state.innerWidth - (state.itemWidth * itemsLeft))
      }

      var itemsShownTotal = (lastSlide)
        ? state.itemsShownTotal + itemsLeft
        : state.itemsShownTotal + state.itemsFitSlide

      this.setState({
        itemsShownTotal: itemsShownTotal,
        innerWidth: innerWidth,
        navPrevDisabled: false,
        navNextDisabled: itemsShownTotal === state.itemsLength
      })
    }

    handlePrev = (e) => {
      var state = this.state

      var innerWidth = state.innerWidth + (state.itemWidth * state.itemsFitSlide)

      var itemsLeft = +Math.abs(state.itemsFitSlide - state.itemsShownTotal)

      var firstSlide = false
      if(itemsLeft <= state.itemsFitSlide) {
        firstSlide = true
        innerWidth = state.startPoint
      }

      var itemsShownTotal = (firstSlide)
        ? state.itemsFitSlide
        : state.itemsShownTotal - state.itemsFitSlide

      this.setState({
        itemsShownTotal: itemsShownTotal,
        innerWidth: innerWidth,
        navPrevDisabled: firstSlide,
        navNextDisabled: false
      })
    }

    render() {
      var props = this.props

      var nav = {
        prev: classNames('navigation prev whiteframe', {
          disabled: this.state.navPrevDisabled
        }),
        next: classNames('navigation next whiteframe', {
          disabled: this.state.navNextDisabled
        })
      }

      return (
        <BlockCollection classNames={"carousel"}>
          <Scaffold>
            <i className={nav.prev} onClick={this.handlePrev}></i>
            <i className={nav.next} onClick={this.handleNext}></i>
            <CollectionHeader>
              {props.route ? (
                <NavLink to={props.route}>
                  <HeaderButton>{this.props.translate('show.more')}</HeaderButton>
                  <h2>{props.title}</h2>
                </NavLink>
              ) : (
                <h2>{props.title}</h2>
              )}
            </CollectionHeader>
            <div className="carousel-wrapper" ref="wrapper">
              <div className="carousel-inner use-transition" style={{transform: `translateX(${this.state.innerWidth}px)`}}>
                <span ref="items">
                  <Poster items={this.props.items} />
                </span>
              </div>
            </div>
          </Scaffold>
        </BlockCollection>
      )
    }

}

export default withTranslate(Carousel)
