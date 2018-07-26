import { Component, Input } from '@angular/core';

import { TooltipService } from '../tooltip';

@Component({
  selector: 'app-poster',
  templateUrl: './poster.component.html',
  styleUrls: ['./poster.component.css'],
})
export class PosterComponent {

  @Input() readonly items: any[];

  constructor(protected readonly tooltip: TooltipService) {}

}
