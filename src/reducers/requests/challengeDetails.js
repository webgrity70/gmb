import { createReducer } from 'redux-starter-kit';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [challengeActions.fetchChallengeDetails.started]: () => ({
    error: null,
    loading: true,
    loaded: false,
  }),
  [challengeActions.fetchChallengeDetails.succeeded]: () => ({
    error: null,
    loading: false,
    loaded: true,
  }),
  [challengeActions.fetchChallengeDetails.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
    loaded: true,
  }),
});

export default reducer;
