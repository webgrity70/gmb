import { createReducer } from 'redux-starter-kit';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [challengeActions.createPlanJoinRegularChallenge.started]: () => ({
    error: null,
    loading: true,
  }),
  [challengeActions.createPlanJoinRegularChallenge.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [challengeActions.createPlanJoinRegularChallenge.failed]: (
    state,
    action
  ) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
