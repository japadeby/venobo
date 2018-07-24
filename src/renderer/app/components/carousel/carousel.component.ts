import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

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

  @ViewChild('poster') poster: ElementRef;

  @ViewChild('wrapper') wrapper: ElementRef;

  @Input() readonly items: any[];

  @Input() readonly route?: string;

  @Input() readonly title?: string;

  ngAfterViewInit() {
    this.updateCarousel();
    window.addEventListener('resize', () => this.updateCarousel(), false);
  }

  updateCarousel() {
    const posterItems = this.poster.nativeElement.querySelectorAll('.react-item');
    const posterItem = this.poster.nativeElement.querySelector('.react-item');
    const startPoint = 0; // parseInt(this.poster.nativeElement.style.marginLeft, 10);
    const maxw = this.wrapper.nativeElement.offsetWidth;

    const itemsFitSlide = Array.from(posterItems).filter((item: HTMLElement) => {
      const rect = item.getBoundingClientRect();

      return rect.left < maxw;
    }).length;


    setTimeout(() => {
      this.navPrevDisabled = true;
      this.innerWidth = -startPoint;
      this.startPoint = -startPoint;
      this.itemsShownTotal = itemsFitSlide;
      this.itemWidth = posterItem.getBoundingClientRect().width;
      this.navNextDisabled = itemsFitSlide === posterItems.length;
      this.itemsLength = posterItems.length;
      this.itemsFitSlide = itemsFitSlide;

      console.log(this);
    }, 7);
  }

  // @TODO: Fix itemWidth
  handlePrev() {
    const itemsLeft = +Math.abs(this.itemsFitSlide - this.itemsShownTotal);
    const firstSlide = itemsLeft <= this.itemsFitSlide;

    this.innerWidth = !firstSlide
      ? this.innerWidth + (this.itemWidth * this.itemsFitSlide)
      : this.startPoint;

    this.itemsShownTotal = !firstSlide
      ? this.itemsShownTotal - this.itemsFitSlide
      : this.itemsFitSlide;

    this.navPrevDisabled = firstSlide;
    this.navNextDisabled = false;
  }

  // @TODO: Fix itemWidth
  handleNext() {
    const itemsLeft = this.itemsLength - this.itemsShownTotal;
    const lastSlide = this.itemsFitSlide > itemsLeft;

    this.innerWidth = !lastSlide
      ? -Math.abs(this.innerWidth - (this.itemWidth * this.itemsFitSlide))
      : -Math.abs(this.innerWidth - (this.itemWidth * itemsLeft));

    this.itemsShownTotal = !lastSlide
      ? this.itemsShownTotal + this.itemsFitSlide
      : this.itemsShownTotal + itemsLeft;

    this.navPrevDisabled = false;
    this.navNextDisabled = this.itemsShownTotal === this.itemsLength;
  }

}
