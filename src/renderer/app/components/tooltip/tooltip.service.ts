import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Metadata } from '../../../metadata';
import { AppState } from '../../app-store.module';
import {
  TooltipDismissDelay,
  TooltipToggleTransform,
} from './tooltip.actions';

@Injectable()
export class TooltipService {

  public hoveringPoster: boolean = false;
  public hoveringTooltip: boolean = false;

  constructor(private readonly store: Store<AppState>) {}

  public show({ target }: MouseEvent, item: Metadata) {
    this.hoveringPoster = true;

    this.store.dispatch(
      new TooltipToggleTransform({
        target,
        item,
      }),
    );
  }

  public dismiss({ fromTooltip, fromPoster }: { [name: string]: boolean; }) {
    if (fromTooltip) this.hoveringTooltip = false;
    if (fromPoster) this.hoveringPoster = false;

    this.store.dispatch(new TooltipDismissDelay());
  }

}
