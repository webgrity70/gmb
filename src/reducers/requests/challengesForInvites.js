import { createReducer } from 'redux-starter-kit';
import {
  fetchChallengesForInvitesStarted,
  fetchChallengesForInvitesFailed,
  fetchChallengesForInvitesSucceeded,
} from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  error: false,
};

const reducer = createReducer(initialState, {
  [fetchChallengesForInvitesStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [fetchChallengesForInvitesSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [fetchChallengesForInvitesFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
