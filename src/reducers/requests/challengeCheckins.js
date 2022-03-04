import { createReducer } from 'redux-starter-kit';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [challengeActions.fetchChallengeCheckins.started]: () => ({
    error: null,
    loading: true,
    loaded: false,
  }),
  [challengeActions.fetchChallengeCheckins.succeeded]: () => ({
    error: null,
    loading: false,
    loaded: true,
  }),
  [challengeActions.fetchChallengeCheckins.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
    loaded: true,
  }),
});

export default reducer;
