import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../app-store.module';
import { TooltipState } from './tooltip.reducer';
import { TooltipService } from './tooltip.service';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
})
export class TooltipComponent {

  protected readonly state$: Observable<TooltipState> = this.store.pipe(select('tooltip'));

  constructor(
    protected readonly tooltipService: TooltipService,
    private readonly store: Store<AppState>,
  ) {}

}
