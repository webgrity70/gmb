// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import {
  fetchThreadMessagesSucceeded,
  messageReceived,
  leaveChat,
} from '../../Actions/action_group_chat';
import { logout } from '../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchThreadMessagesSucceeded]: (state, action) => {
    const { groupId, data } = action.payload;
    const messages = data.results || [];
    state[groupId] = state[groupId] || {};
    messages.forEach((message) => {
      state[groupId][message.id] = message;
    });
  },
  [messageReceived]: (state, action) => {
    const { groupId, message } = action.payload;
    state[groupId] = state[groupId] || {};
    state[groupId][message.id] = message;
  },
  [leaveChat.succeeded]: (state, action) => {
    const { groupId } = action.payload;
    return omit(state, groupId);
  },
  [logout]: () => initialState,
});

export default reducer;
