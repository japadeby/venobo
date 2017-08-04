<<<<<<< HEAD:src/renderer/components/carousel.js
import React from 'react'
=======
import React, { Component } from 'react'
>>>>>>> redux-dev:src/renderer/components/Carousel.js
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'

import { withTranslate } from './react-multilingual'

<<<<<<< HEAD:src/renderer/components/carousel.js
import {withTranslate} from '../utils/react-multilingual'
import {dispatch} from '../lib/dispatcher'

import Poster from './poster'
=======
import Poster from './Poster'
>>>>>>> redux-dev:src/renderer/components/Carousel.js
import {
  Scaffold,
  BlockCollection,
  CollectionHeader,
  HeaderButton
} from './Items'

class Carousel extends Component {

  state = {
    navPrevDisabled: true
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
    const { props, state } = this

    const nav = {
      prev: classNames('navigation prev whiteframe', {
        disabled: state.navPrevDisabled
      }),
      next: classNames('navigation next whiteframe', {
        disabled: state.navNextDisabled
      })
    }

<<<<<<< HEAD:src/renderer/components/carousel.js
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
                <a href="#" onClick={() => dispatch(props.route)}>
                  <HeaderButton>{this.props.translate('show.more')}</HeaderButton>
                  <h2>{props.title}</h2>
                </a>
              ) : (
                <h2>{props.title}</h2>
              )}
            </CollectionHeader>
            <div className="carousel-wrapper" ref="wrapper">
              <div className="carousel-inner use-transition" style={{transform: `translateX(${this.state.innerWidth}px)`}}>
                <span ref="items">
                  <Poster items={this.props.items} />
=======
    return (
      <BlockCollection className="portrait carousel">
        <Scaffold>
          <i className={nav.prev} onClick={this.handlePrev}></i>
          <i className={nav.next} onClick={this.handleNext}></i>
          <CollectionHeader>
            {props.route ? (
              <NavLink to={props.route}>
                <span>
                  <HeaderButton>{props.translate('show.more')}</HeaderButton>
                  <h2>{props.title}</h2>
>>>>>>> redux-dev:src/renderer/components/Carousel.js
                </span>
              </NavLink>
            ) : (
              <h2>{props.title}</h2>
            )}
          </CollectionHeader>
          <div className="carousel-wrapper" ref="wrapper">
            <div className="carousel-inner use-transition" style={{transform: `translateX(${state.innerWidth}px)`}}>
              <div ref="items">
                <Poster items={props.items} />
              </div>
            </div>
          </div>
        </Scaffold>
      </BlockCollection>
    )
  }

}

export default withTranslate(Carousel)
