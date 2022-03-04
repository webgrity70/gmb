// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import {
  fetchThreadMessagesSucceeded,
  messageReceived,
  resetThread,
  leaveChat,
} from '../../Actions/actions_challenges_chat';
import { leaveChallenge } from '../../Actions/actions_challenges';
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
    const { challengeId, data } = action.payload;
    const messages = data.results || [];
    state[challengeId] = state[challengeId] || { ...initialGroupState };
    const history = state[challengeId];
    history.prev = data.previous;
    history.next = data.next;
    messages.forEach((message) => {
      binarySearchInsert(history.messages, (a, b) => a - b, message.id);
    });
  },
  [messageReceived]: (state, action) => {
    const { challengeId, message } = action.payload;
    state[challengeId] = state[challengeId] || { ...initialGroupState };
    const history = state[challengeId];
    binarySearchInsert(history.messages, (a, b) => a - b, message.id);
  },
  [resetThread]: (state, action) => {
    const { challengeId } = action.payload;
    state[challengeId] = initialGroupState;
  },
  [leaveChallenge.succeeded]: (state, action) => {
    const { challengeId } = action.payload;
    return omit(state, challengeId);
  },
  [leaveChat.succeeded]: (state, action) => {
    const { challengeId } = action.payload;
    return omit(state, challengeId);
  },
  [logout]: () => initialState,
});

export default reducer;
