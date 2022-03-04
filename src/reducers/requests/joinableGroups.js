import { createReducer } from 'redux-starter-kit';
import * as groupsActions from '../../Actions/action_group_chat';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [groupsActions.fetchJoinableGroupsThreadsStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [groupsActions.fetchJoinableGroupsThreadsSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [groupsActions.fetchJoinableGroupsThreadsFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
