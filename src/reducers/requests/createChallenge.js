import { createReducer } from 'redux-starter-kit';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [challengeActions.createChallenge.started]: () => ({
    error: null,
    loading: true,
  }),
  [challengeActions.createChallenge.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [challengeActions.createChallenge.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
