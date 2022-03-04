import { createReducer } from 'redux-starter-kit';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [challengeActions.fetchCalendarPlan.started]: () => ({
    error: null,
    loading: true,
  }),
  [challengeActions.fetchCalendarPlan.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [challengeActions.fetchCalendarPlan.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
