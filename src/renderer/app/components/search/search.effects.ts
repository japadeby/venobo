import { Injectable } from '@angular/core';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { Actions, Effect, ofType } from '@ngrx/effects';
// import { SearchActionTypes, Toggle } from './search.actions';
import { tap } from 'rxjs/operators';

@Injectable()
export class SearchEffects {

  constructor(private readonly actions$: Actions) {}

  /*@Effect()
  toggleAction$ = this.actions$.pipe(
    ofType<Toggle>(SearchActionTypes.TOGGLE),
    tap(action => console.log(action)),
  );*/

  @Effect({ dispatch: false })
  routerNavigation$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    tap(action => console.log(action)),
  );

}
