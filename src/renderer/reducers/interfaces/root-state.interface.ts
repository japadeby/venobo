import { Router } from 'react-router';

import { SearchState } from '../../components/Search/state';

export interface RootState {
  readonly router: Router;
  readonly search: SearchState;
}