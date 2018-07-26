import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  StoreRouterConnectingModule,
  RouterReducerState,
  routerReducer,
} from '@ngrx/router-store';
import {
  searchReducer,
  SearchState,
  tooltipReducer,
  TooltipState,
} from './components';

export interface AppState {
  tooltip: TooltipState;
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
      tooltip: tooltipReducer,
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
