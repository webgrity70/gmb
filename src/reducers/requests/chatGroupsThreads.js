import { createReducer } from 'redux-starter-kit';
import * as chatActions from '../../Actions/action_group_chat';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [chatActions.fetchGroupsThreadsStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [chatActions.fetchGroupsThreadsSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [chatActions.fetchGroupsThreadsFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
