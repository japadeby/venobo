/*import { $call } from 'utility-types';

import * as SearchActions from '../components/Search';

const returnsOfActions = {
  ...Object.values(SearchActions).map($call),
};

export type RootAction = typeof returnsOfActions[number];*/

export interface RootAction<A> {
  type: any;
  payload: A;
}