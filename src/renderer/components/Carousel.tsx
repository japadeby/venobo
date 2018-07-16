import * as React from 'react';
import * as classNames from 'classnames';
import * as $ from 'jquery';
import { Link } from 'react-router-dom';
import { translate, InjectedTranslateProps } from 'react-i18next';

import { Metadata } from '../../common/api/metadata';
import { Poster } from './Poster';
import {
  Scaffold,
  BlockCollection,
  CollectionHeader,
  HeaderButton
} from './Items';

const initialState = {  };

export interface CarouselProps extends InjectedTranslateProps {
  route?: string;
  title?: string;
  items: Metadata[]
}

export interface CarouselState {
  navPrevDisabled: boolean;
  navNextDisabled?: boolean;
  startPoint?: number;
  itemsShownTotal?: number;
  itemWidth?: number;
  innerWidth?: number;
  itemsFitSlide?: number;
  itemsLength?: number;
}

export class CarouselComp extends React.Component<Partial<CarouselProps>, CarouselState> {

  wrapper!: HTMLElement;
  items!: HTMLElement;

  readonly state: CarouselState = {
    navPrevDisabled: true,
  };

  componentDidMount() {
    this.updateCarousel();
  }

  private updateCarousel() {
    const $reactItems = $(this.items).find('.react-item');
    const maxw = $(this.wrapper).width();

    const itemsFitSlide = $reactItems.filter(function() {
      return $(this).position().left < maxw
    }).length;

    const startPoint = parseInt($reactItems.css('margin-left'));

    this.setState({
      navPrevDisabled: true,
      innerWidth: -startPoint,
      startPoint: -startPoint,
      itemsShownTotal: itemsFitSlide,
      itemWidth: $reactItems.outerWidth(true),
      navNextDisabled: itemsFitSlide === $reactItems.length,
      itemsLength: $reactItems.length,
      itemsFitSlide,
    });
  }

  private handlePrev = () => {
    const { state } = this;

    let innerWidth = state.innerWidth + (state.itemWidth * state.itemsFitSlide);
    const itemsLeft = +Math.abs(state.itemsFitSlide - state.itemsShownTotal);

    let firstSlide = false;
    if (itemsLeft <= state.itemsFitSlide) {
      firstSlide = true;
      innerWidth = state.startPoint;
    }

    const itemsShownTotal = firstSlide
      ? state.itemsFitSlide
      : state.itemsShownTotal - state.itemsFitSlide;

    this.setState({
      navPrevDisabled: firstSlide,
      navNextDisabled: false,
      itemsShownTotal,
      innerWidth,
    });

    return false;
  };

  private handleNext = () => {
    const { state } = this;

    let innerWidth = -Math.abs(state.innerWidth - (state.itemWidth * state.itemsFitSlide));

    const itemsLeft = state.itemsLength - state.itemsShownTotal;
    const lastSlide = state.itemsFitSlide > itemsLeft;

    if (lastSlide) {
      innerWidth = -Math.abs(state.innerWidth - (state.itemWidth * itemsLeft));
    }

    const itemsShownTotal = lastSlide
      ? state.itemsShownTotal + itemsLeft
      : state.itemsShownTotal + state.itemsFitSlide;

    this.setState({
      navPrevDisabled: false,
      navNextDisabled: itemsShownTotal === state.itemsLength,
      itemsShownTotal,
      innerWidth,
    });

    return false;
  };

  private createCollectionHeader = () => (
    <CollectionHeader>
      {this.props.route ? (
        <Link to={this.props.route}>
          <span>
            <HeaderButton>{this.props.t('show.more')}</HeaderButton>
            <h2>{this.props.title}</h2>
          </span>
        </Link>
      ) : (
        <h2>{this.props.title}</h2>
      )}
    </CollectionHeader>
  );

  render() {
    const { state, props } = this;

    const nav = {
      prev: classNames('navigation prev whiteframe', {
        disabled: state.navPrevDisabled,
      }),
      next: classNames('navigation next whiteframe', {
        disabled: state.navNextDisabled,
      }),
    };

    return (
      <BlockCollection className="portrait carousel">
        <Scaffold>
          <i className={nav.prev} onClick={this.handlePrev} />
          <i className={nav.next} onClick={this.handleNext} />
          {this.createCollectionHeader()}
          <div className="carousel-wrapper" ref={ref => this.wrapper = ref}>
            <div className="carousel-inner use-transition" style={{transform: `translateX(${state.innerWidth}px)`}}>
              <div ref={ref => this.items = ref}>
                <Poster items={props.items}/>
              </div>
            </div>
          </div>
        </Scaffold>
      </BlockCollection>
    );
  }

}

export const Carousel = translate()(CarouselComp);