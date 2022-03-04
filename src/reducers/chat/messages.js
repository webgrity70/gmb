// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import {
  fetchThreadMessagesSucceeded,
  messageReceived,
} from '../../Actions/action_chat';
import { logout } from '../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchThreadMessagesSucceeded]: (state, action) => {
    const { threadId, data } = action.payload;
    const messages = data.results || [];
    state[threadId] = state[threadId] || {};
    messages.forEach((message) => {
      state[threadId][message.id] = message;
    });
  },
  [messageReceived]: (state, action) => {
    const { threadId, message } = action.payload;
    state[threadId] = state[threadId] || {};
    state[threadId][message.id] = message;
  },
  [logout]: () => initialState,
});

export default reducer;
