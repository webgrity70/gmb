import { createReducer } from 'redux-starter-kit';
import * as challengesActions from '../../Actions/actions_challenges_chat';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [challengesActions.fetchChallengesThreadsStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [challengesActions.fetchChallengesThreadsSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [challengesActions.fetchChallengesThreadsFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
