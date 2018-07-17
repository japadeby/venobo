import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../app-store.module';

export interface SearchState {
  active: boolean;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {

  readonly state: Observable<SearchState> = this.store.pipe(select('search'));

  constructor(private readonly store: Store<AppState>) {}

}
