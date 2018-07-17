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

export interface AppState {
  search: SearchState;
  router: RouterReducerState;
}

@NgModule({
  exports: [
    StoreModule,
    StoreRouterConnectingModule,
  ],
  imports: [
    StoreModule.forRoot({
      router: routerReducer,
      search: searchReducer,
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
    }),
  ],
})
export class AppStoreModule {}
