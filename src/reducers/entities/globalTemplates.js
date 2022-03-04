import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import * as plansActions from '../../Actions/actions_plan';

const initialState = {};
const reducer = createReducer(initialState, {
  [plansActions.fetchGlobalTemplatesSucceeded.type]: (state, { payload }) => {
    const results = keyBy(payload.results, 'id');
    return payload.previous ? { ...state, ...results } : results;
  },
});

export default reducer;
