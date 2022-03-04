import { createReducer } from 'redux-starter-kit';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [challengeActions.createPlanJoinFlashChallenge.started]: () => ({
    error: null,
    loading: true,
  }),
  [challengeActions.createPlanJoinFlashChallenge.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [challengeActions.createPlanJoinFlashChallenge.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
