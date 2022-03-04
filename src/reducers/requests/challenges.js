import { createReducer } from 'redux-starter-kit';
import {
  fetchChallengesSucceeded,
  fetchChallengesFailed,
  fetchChallengesStarted,
} from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  error: false,
};

const reducer = createReducer(initialState, {
  [fetchChallengesStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [fetchChallengesSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [fetchChallengesFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
