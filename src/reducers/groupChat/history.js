// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import {
  fetchThreadMessagesSucceeded,
  messageReceived,
  resetThread,
  leaveChat,
} from '../../Actions/action_group_chat';
import binarySearchInsert from '../../utils/binarySearchInsert';
import { logout } from '../../Actions/actions_user';

const initialState = {};
const initialGroupState = {
  prev: undefined,
  next: undefined,
  messages: [],
};

const reducer = createReducer(initialState, {
  [fetchThreadMessagesSucceeded]: (state, action) => {
    const { groupId, data } = action.payload;
    const messages = data.results || [];
    state[groupId] = state[groupId] || { ...initialGroupState };
    const history = state[groupId];
    history.prev = data.previous;
    history.next = data.next;
    messages.forEach((message) => {
      binarySearchInsert(history.messages, (a, b) => a - b, message.id);
    });
  },
  [messageReceived]: (state, action) => {
    const { groupId, message } = action.payload;
    state[groupId] = state[groupId] || { ...initialGroupState };
    const history = state[groupId];
    binarySearchInsert(history.messages, (a, b) => a - b, message.id);
  },
  [resetThread]: (state, action) => {
    const { groupId } = action.payload;
    state[groupId] = initialGroupState;
  },
  [leaveChat.succeeded]: (state, action) => {
    const { groupId } = action.payload;
    return omit(state, groupId);
  },
  [logout]: () => initialState,
});

export default reducer;
