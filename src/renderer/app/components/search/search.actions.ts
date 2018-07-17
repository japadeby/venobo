import { Action } from '@ngrx/store';

export enum SearchActionTypes {
  TOGGLE = '[Search] Toogle',
  DISMISS = '[Search] Dismiss',
  ALL = '[Search] All',
}

export class SearchToggle implements Action {
  readonly type = SearchActionTypes.TOGGLE;
}

export class SearchDismiss implements Action {
  readonly type = SearchActionTypes.DISMISS;
}


export class SearchAll implements Action {
  readonly type = SearchActionTypes.ALL;
}

export type SearchActionsUnion = SearchToggle | SearchDismiss | SearchAll;
