import React from 'react'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import { withTranslate } from '../utils/react-multilingual'

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
      const {state} = this
      const $reactItems = $(this.refs.items).children().children('.react-item')
      const maxw = $(this.refs.wrapper).width()

      let itemsFitSlide = $reactItems.filter(function() {
        return $(this).position().left < maxw
      }).length

      const startPoint = parseInt($reactItems.css('margin-left'))

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
      const {state} = this

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
      const {state} = this

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
      const {props, state} = this

      var nav = {
        prev: classNames('navigation prev whiteframe', {
          disabled: state.navPrevDisabled
        }),
        next: classNames('navigation next whiteframe', {
          disabled: state.navNextDisabled
        })
      }

      return (
        <BlockCollection classNames="portrait carousel">
          <Scaffold>
            <i className={nav.prev} onClick={this.handlePrev}></i>
            <i className={nav.next} onClick={this.handleNext}></i>
            <CollectionHeader>
              {props.route ? (
                <NavLink to={props.route}>
                  <HeaderButton>{props.translate('show.more')}</HeaderButton>
                  <h2>{props.title}</h2>
                </NavLink>
              ) : (
                <h2>{props.title}</h2>
              )}
            </CollectionHeader>
            <div className="carousel-wrapper" ref="wrapper">
              <div className="carousel-inner use-transition" style={{transform: `translateX(${state.innerWidth}px)`}}>
                <span ref="items">
                  <Poster items={props.items} state={props.state} />
                </span>
              </div>
            </div>
          </Scaffold>
        </BlockCollection>
      )
    }

}

export default withTranslate(Carousel)
