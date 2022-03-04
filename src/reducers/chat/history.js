// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import {
  fetchThreadMessagesSucceeded,
  messageReceived,
  resetThread,
} from '../../Actions/action_chat';
import binarySearchInsert from '../../utils/binarySearchInsert';
import { logout } from '../../Actions/actions_user';

const initialState = {};
const initialThreadState = {
  prev: undefined,
  next: undefined,
  messages: [],
};

const reducer = createReducer(initialState, {
  [fetchThreadMessagesSucceeded]: (state, action) => {
    const { threadId, data } = action.payload;
    const messages = data.results || [];
    state[threadId] = state[threadId] || { ...initialThreadState };
    const history = state[threadId];
    history.prev = data.previous;
    history.next = data.next;
    messages.forEach((message) => {
      binarySearchInsert(history.messages, (a, b) => a - b, message.id);
    });
  },
  [messageReceived]: (state, action) => {
    const { threadId, message } = action.payload;
    state[threadId] = state[threadId] || { ...initialThreadState };
    const history = state[threadId];
    binarySearchInsert(history.messages, (a, b) => a - b, message.id);
  },
  [resetThread]: (state, action) => {
    const { threadId } = action.payload;
    state[threadId] = initialThreadState;
  },
  [logout]: () => initialState,
});

export default reducer;
