import { createReducer } from 'redux-starter-kit';
import {
  fetchMembersStarted,
  fetchMembersSucceeded,
  fetchMembersFailed,
} from '../../Actions/actions_challenges';

const initialState = {
  loading: false,
  error: false,
};

const reducer = createReducer(initialState, {
  [fetchMembersStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [fetchMembersSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [fetchMembersFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
