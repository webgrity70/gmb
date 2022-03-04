import { createReducer } from 'redux-starter-kit';
import {
  fetchMembersSucceeded,
  fetchChallengeDetails,
  fetchMembersFailed,
} from '../../Actions/actions_challenges';

const initialState = {
  next: null,
  previous: null,
};

const reducer = createReducer(initialState, {
  [fetchChallengeDetails.succeeded]: () => initialState,
  [fetchMembersSucceeded.type]: (state, { payload }) => ({
    next: payload.data.next,
    previous: payload.data.previous,
  }),
  [fetchMembersFailed]: () => initialState,
});

export default reducer;
