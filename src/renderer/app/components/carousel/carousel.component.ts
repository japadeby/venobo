import { Component, Input, OnInit } from '@angular/core';

export interface CarouselComponentState {
  navPrevDisabled: boolean;
  navNextDisabled?: boolean;
  startPoint?: number;
  itemsShownTotal?: number;
  itemWidth?: number;
  innerWidth?: number;
  itemsFitSlide?: number;
  itemsLength?: number;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements CarouselComponentState, OnInit {

  navPrevDisabled = true;

  @Input() readonly items: any[];

  @Input() readonly route?: string;

  @Input() readonly title?: string;

  ngOnInit() {
    this.updateCarousel();
  }

  protected updateCarousel() {

  }

  protected handlePrev() {

  }

  protected handleNext() {}

}
