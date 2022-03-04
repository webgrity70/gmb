// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import {
  connectSocketSucceeded,
  disconnectSocketSucceeded,
  resetThread,
  messageDraftChanged,
} from '../../Actions/action_chat';
import { logout } from '../../Actions/actions_user';

const initialState = {};
const initialThreadState = { socketOnline: false };
const reducer = createReducer(initialState, {
  [connectSocketSucceeded]: (state, action) => {
    const { threadId } = action.payload;
    const group = state[threadId] || initialThreadState;
    group.socketOnline = true;
    state[threadId] = group;
  },
  [messageDraftChanged]: (state, action) => {
    const { threadId, message } = action.payload;
    const thread = state[threadId] || initialThreadState;
    thread.draft = message;
    state[threadId] = thread;
  },
  [disconnectSocketSucceeded]: (state, action) => {
    const { threadId } = action.payload;
    const thread = state[threadId];
    if (thread) {
      thread.socketOnline = false;
    }
  },
  [resetThread]: (state, action) => {
    const { threadId } = action.payload;
    state[threadId] = initialThreadState;
  },
  [logout]: () => initialState,
});

export default reducer;
