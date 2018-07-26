import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {
  debounceTime,
  map,
  skipWhile,
  pluck,
  shareReplay,
  tap,
} from 'rxjs/operators';

import { TooltipService } from './tooltip.service';
import { TooltipState } from './tooltip.reducer';
import {
  TooltipActionTypes,
  TooltipDismiss,
  TooltipToggle,
} from './tooltip.actions';

@Injectable()
export class TooltipEffects {

  constructor(
    private readonly tooltipService: TooltipService,
    private readonly actions$: Actions,
  ) {}

  // @TODO: Fix this
  @Effect()
  dismissTooltipDelay$ = this.actions$.pipe(
    ofType(TooltipActionTypes.DISMISS_DELAY),
    debounceTime(500),
    skipWhile(() =>
      this.tooltipService.hoveringPoster ||
      this.tooltipService.hoveringTooltip,
    ),
    map(() => new TooltipDismiss()),
  );

  @Effect()
  toggleTooltipTransform$ = this.actions$.pipe(
    ofType(TooltipActionTypes.TOGGLE_TRANSFORM),
    debounceTime(700),
    skipWhile(() =>
      !this.tooltipService.hoveringPoster,
    ),
    pluck('payload'),
    map(({ target, item, }) => {
      const front = target.closest('.react-item');
      const frontBounds = front.getBoundingClientRect();

      const payload: TooltipState = {
        active: true,
        arrow: 70,
        position: '',
        stylePosition: {},
        item,
      };

      // tooltip is 300px wide
      const tooltipWidth = 300;
      let tooltipPosLeft = frontBounds.left + frontBounds.width + 10;
      const tooltipPosTop = frontBounds.top + 15;

      if (tooltipPosLeft + tooltipWidth > window.innerWidth) {
        tooltipPosLeft = frontBounds.width + tooltipWidth;
        payload.position += 'left';
      }

      if (tooltipPosTop <= 25) {
        tooltipPosLeft -= 20;
        payload.position += ' menu-offset fixed-top';
      } else if (tooltipPosTop >= Math.abs(frontBounds.top - window.outerHeight + 30)) {
        tooltipPosLeft -= 20;
        payload.arrow = 300;
        payload.position += ' fixed-bottom';
      } else {
        payload.stylePosition.top = `${tooltipPosTop}px`;
      }

      payload.stylePosition.left = `${tooltipPosLeft}px`;
      payload.pageLink = `/media/${item.type}/${item.tmdb}`;

      return new TooltipToggle(payload);
    }),
  );

}
