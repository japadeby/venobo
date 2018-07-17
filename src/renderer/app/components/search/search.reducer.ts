import { SearchActionTypes, SearchActionsUnion } from './search.actions';
import { SearchState } from './search.component';

export const initialState = {
  active: false,
};

export function searchReducer(
  state: SearchState = initialState,
  action: SearchActionsUnion,
): SearchState {
 switch (action.type) {
   case SearchActionTypes.TOGGLE:
     return {
       ...state,
      active: true,
     };

   case SearchActionTypes.DISMISS:
     return {
       ...state,
       active: false,
     };

   default:
     return state;
 }
}
