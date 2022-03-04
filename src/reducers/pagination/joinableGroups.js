import { createReducer } from 'redux-starter-kit';
import * as groupsChatActions from '../../Actions/action_group_chat';

const initialState = {
  next: null,
  previous: null,
};

const reducer = createReducer(initialState, {
  [groupsChatActions.fetchJoinableGroupsThreadsSucceeded.type]: (
    state,
    action
  ) => ({
    next: action.payload.next,
    previous: action.payload.previous,
  }),
});

export default reducer;
