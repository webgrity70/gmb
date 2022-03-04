import { createReducer } from 'redux-starter-kit';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [challengeActions.leaveChallenge.started]: () => ({
    error: null,
    loading: true,
  }),
  [challengeActions.leaveChallenge.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [challengeActions.leaveChallenge.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
