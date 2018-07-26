import { Metadata } from '../../../metadata';
import {
  TooltipActionsUnion,
  TooltipActionTypes,
} from './tooltip.actions';

export interface TooltipState {
  active: boolean;
  hovering?: boolean;
  item?: Metadata;
  arrow?: number;
  pageLink?: string;
  position?: string;
  stylePosition?: {
    top?: string;
    left?: string;
  };
}

export const initialState: TooltipState = {
  active: false,
};

export function tooltipReducer(
  state: TooltipState = initialState,
  action: TooltipActionsUnion,
): TooltipState {
  switch (action.type) {
    case TooltipActionTypes.TOGGLE:
      return {
        ...state,
        ...action.payload,
      };

    case TooltipActionTypes.DISMISS:
      return {
        ...state,
        active: false,
      };

    default:
      return state;
  }
}
