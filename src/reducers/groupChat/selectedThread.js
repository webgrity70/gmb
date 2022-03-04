// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import get from 'lodash/get';
import { logout } from '../../Actions/actions_user';
import {
  selectThread,
  showThreads,
  fetchGroupsThreadsSucceeded,
  leaveChat,
} from '../../Actions/action_group_chat';

const initialState = null;
const reducer = createReducer(initialState, {
  [selectThread]: (state, action) =>
    get(action.payload, 'groupId', initialState),
  [showThreads]: () => initialState,
  [leaveChat.succeeded]: (state, action) => {
    const { groupId } = action.payload;
    if (state === groupId) return null;
    return state;
  },
  [fetchGroupsThreadsSucceeded.type]: (state, action) => {
    const isPaginationRequest = action.payload.previous;
    if (isPaginationRequest) return state;
    return action.payload.results.some((thread) => thread.id === state)
      ? state
      : state;
  },
  [logout]: () => initialState,
});

export default reducer;
