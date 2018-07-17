import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-poster',
  templateUrl: './poster.component.html',
  styleUrls: ['./poster.component.css'],
})
export class PosterComponent {

  @Input() readonly items: any[];

  showTooltip() {}

  dismissTooltipDelay() {}

}
