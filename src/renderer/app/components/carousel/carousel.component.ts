import { Component, Input, AfterViewInit, ViewChild } from '@angular/core';

export class CarouselComponentState {
  navPrevDisabled!: boolean;
  navNextDisabled!: boolean;
  startPoint!: number;
  itemsShownTotal!: number;
  itemWidth!: number;
  innerWidth!: number;
  itemsFitSlide!: number;
  itemsLength!: number;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent extends CarouselComponentState implements AfterViewInit {

  @ViewChild('poster') poster: HTMLElement;

  @ViewChild('wrapper') wrapper: HTMLElement;

  @Input() readonly items: any[];

  @Input() readonly route?: string;

  @Input() readonly title?: string;

  ngAfterViewInit() {
    this.updateCarousel();
  }

  updateCarousel() {
    const posterItems = this.poster.querySelectorAll('.react-item');
    const startPoint = this.poster.style.marginLeft;
    const maxw = this.wrapper.offsetWidth;

    const itemsFitSlide = Array.from(posterItems).filter((item: HTMLElement) => {
      const rect = item.getBoundingClientRect();

      return rect.left < maxw;
    }).length;

    this.navPrevDisabled = true;
    this.innerWidth = -startPoint;
    this.startPoint = -startPoint;
    this.itemsShownTotal = itemsFitSlide;
    this.itemWidth = this.poster.offsetWidth;
    this.navNextDisabled = itemsFitSlide === posterItems.length;
    this.itemsLength = posterItems.length;
    this.itemsFitSlide = itemsFitSlide;

    console.log(this);
  }

  handlePrev() {

  }

  handleNext() {}

}
