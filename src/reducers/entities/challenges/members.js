import { createReducer } from 'redux-starter-kit';
import { fetchMembersSucceeded } from '../../../Actions/actions_challenges';

const initialState = {};

const reducer = createReducer(initialState, {
  [fetchMembersSucceeded.type]: (state, { payload }) => ({
    ...state,
    [payload.challengeId]: payload.data.previous
      ? [...state[payload.challengeId], ...payload.data.results]
      : payload.data.results,
  }),
});

export default reducer;
