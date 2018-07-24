import { Injectable } from '@angular/core';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Actions, Effect, ofType } from '@ngrx/effects';
// import { SearchActionTypes, Toggle } from './search.actions';
import { mergeMap, tap } from 'rxjs/operators';

import { SearchDismiss } from './search.actions';

@Injectable()
export class SearchEffects {

  constructor(private readonly actions$: Actions) {}

  @Effect()
  routerNavigation$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    mergeMap(() => [
      new SearchDismiss(),
    ]),
  );

}
