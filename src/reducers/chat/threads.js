// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import {
  fetchThreads,
  setThreadAsRead,
  messageReceived,
  leaveChat,
} from '../../Actions/action_chat';
import { buddyHasAccepted } from '../../Actions/action_buddy_request';
import { logout } from '../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchThreads.succeeded]: (state, action) => keyBy(action.payload, 'id'),
  [setThreadAsRead.succeeded]: (state, action) => {
    const { threadId } = action.payload;
    if (state[threadId]) {
      state[threadId].newMessages = 0;
    }
  },
  [setThreadAsRead.succeeded]: (state, action) => {
    const { threadId } = action.payload;
    if (state[threadId]) {
      state[threadId].newMessages = 0;
    }
  },
  [messageReceived]: (state, action) => {
    const { threadId } = action.payload;
    if (state[threadId]) {
      const count = state[threadId].newMessages || 0;
      state[threadId].newMessages = count + 1;
    }
  },
  [buddyHasAccepted.type]: (state, action) => {
    const { id } = action.payload;
    if (state[id]) {
      state[id].participantA.accepted = true;
      state[id].participantB.accepted = true;
    }
  },
  [leaveChat.succeeded.type]: (state, action) => {
    const { threadId } = action.payload;
    return omit(state, threadId);
  },
  [logout]: () => initialState,
});

export default reducer;
