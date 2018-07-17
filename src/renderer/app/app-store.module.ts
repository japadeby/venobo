import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import {
  StoreRouterConnectingModule,
  RouterReducerState,
  routerReducer,
} from '@ngrx/router-store';
import {
  searchReducer,
  SearchState
} from './components/search';
import { EffectsModule } from '@ngrx/effects';

export interface AppState {
  search: SearchState;
  router: RouterReducerState;
}

@NgModule({
  exports: [
    StoreModule,
    StoreRouterConnectingModule,
    EffectsModule,
  ],
  imports: [
    StoreModule.forRoot({
      router: routerReducer,
      search: searchReducer,
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    }),
    EffectsModule.forRoot([]),
  ],
})
export class AppStoreModule {}
