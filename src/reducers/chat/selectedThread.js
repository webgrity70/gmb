// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import {
  selectThread,
  showThreads,
  fetchThreads,
  leaveChat,
} from '../../Actions/action_chat';
import { logout } from '../../Actions/actions_user';

const initialState = null;
const reducer = createReducer(initialState, {
  [selectThread]: (state, action) => action.payload.threadId,
  [showThreads]: () => initialState,
  [leaveChat.succeeded.type]: () => initialState,
  [fetchThreads.succeeded]: (state, action) =>
    action.payload.some((thread) => thread.id === state) ? state : initialState,
  [logout]: () => initialState,
});

export default reducer;
