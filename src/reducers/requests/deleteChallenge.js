import { createReducer } from 'redux-starter-kit';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [challengeActions.deleteChallenge.started]: () => ({
    error: null,
    loading: true,
  }),
  [challengeActions.deleteChallenge.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [challengeActions.deleteChallenge.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
