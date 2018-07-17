import { Action } from '@ngrx/store';

export enum SearchActionTypes {
  TOGGLE = '[Search] Toogle',
  DISMISS = '[Search] Dismiss',
  ALL = '[Search] All',
}

export class Toggle implements Action {
  readonly type = SearchActionTypes.TOGGLE;
}

export class Dismiss implements Action {
  readonly type = SearchActionTypes.DISMISS;
}


export class All implements Action {
  readonly type = SearchActionTypes.ALL;
}

export type SearchActionsUnion = Toggle | Dismiss | All;
