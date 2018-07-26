import { Action } from '@ngrx/store';

import { Metadata } from '../../../metadata';

export enum TooltipActionTypes {
  TOGGLE = '[Tooltip] Toggle',
  TOGGLE_TRANSFORM = '[Tooltip] Toggle Transform',
  DISMISS = '[Tooltip] Dismiss',
  DISMISS_DELAY = '[Tooltip] Dismiss Delay',
}

export class TooltipToggle implements Action {
  readonly type = TooltipActionTypes.TOGGLE;

  constructor(public readonly payload: any) {}
}

export class TooltipToggleTransform implements Action {
  readonly type = TooltipActionTypes.TOGGLE_TRANSFORM;

  constructor(public readonly payload: {
    target: EventTarget,
    item: Metadata,
  }) {}
}

export class TooltipDismiss implements Action {
  readonly type = TooltipActionTypes.DISMISS;
}

export class TooltipDismissDelay implements Action {
  readonly type = TooltipActionTypes.DISMISS_DELAY;
}

export type TooltipActionsUnion = |
  TooltipToggle |
  TooltipDismiss |
  TooltipDismissDelay |
  TooltipToggleTransform;
