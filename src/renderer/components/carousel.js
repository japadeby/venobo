import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import { withTranslate } from './react-multilingual'

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
      $(window).off("resize", this.updateCarousel)
    }

    updateCarousel = () => {
      const {state} = this
      const $reactItems = $(this.refs.items).find('.react-item')
      const maxw = $(this.refs.wrapper).width()

      const itemsFitSlide = $reactItems.filter(function() {
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
      $(window).on("resize", this.updateCarousel)
    }

    handleNext = (e) => {
      const {state} = this

      var innerWidth = -Math.abs(state.innerWidth - (state.itemWidth * state.itemsFitSlide))

      const itemsLeft = state.itemsLength - state.itemsShownTotal
      const lastSlide = state.itemsFitSlide > itemsLeft

      if (lastSlide) {
        innerWidth = -Math.abs(state.innerWidth - (state.itemWidth * itemsLeft))
      }

      const itemsShownTotal = lastSlide
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

      const itemsLeft = +Math.abs(state.itemsFitSlide - state.itemsShownTotal)

      var firstSlide = false
      if(itemsLeft <= state.itemsFitSlide) {
        firstSlide = true
        innerWidth = state.startPoint
      }

      const itemsShownTotal = (firstSlide)
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
                  <span>
                    <HeaderButton>{props.translate('show.more')}</HeaderButton>
                    <h2>{props.title}</h2>
                  </span>
                </NavLink>
              ) : (
                <h2>{props.title}</h2>
              )}
            </CollectionHeader>
            <div className="carousel-wrapper" ref="wrapper">
              <div className="carousel-inner use-transition" style={{transform: `translateX(${state.innerWidth}px)`}}>
                <div ref="items">
                  <Poster items={props.items} state={props.state} />
                </div>
              </div>
            </div>
          </Scaffold>
        </BlockCollection>
      )
    }

}

export default withTranslate(Carousel)
