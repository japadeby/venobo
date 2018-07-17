import { Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import { Observable } from 'rxjs';

import { AppState } from '../../app-store.module';
import * as SearchActions from '../search/search.actions';
import { SearchState } from '../search';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  readonly search: Observable<SearchState> = this.store.pipe(select('search'));

  hoverActive = false;

  constructor(private readonly store: Store<AppState>) {}

  toggleSearch = () => this.store.dispatch(new SearchActions().Toggle());

  hoverDetails = () => this.hoverActive = !this.hoverActive;

  quitApp = () => ipcRenderer.emit('appQuit');

}
