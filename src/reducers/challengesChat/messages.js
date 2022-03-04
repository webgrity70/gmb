// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import {
  fetchThreadMessagesSucceeded,
  messageReceived,
  leaveChat,
} from '../../Actions/actions_challenges_chat';
import { leaveChallenge } from '../../Actions/actions_challenges';
import { logout } from '../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchThreadMessagesSucceeded]: (state, action) => {
    const { challengeId, data } = action.payload;
    const messages = data.results || [];
    state[challengeId] = state[challengeId] || {};
    messages.forEach((message) => {
      state[challengeId][message.id] = message;
    });
  },
  [messageReceived]: (state, action) => {
    const { challengeId, message } = action.payload;
    state[challengeId] = state[challengeId] || {};
    state[challengeId][message.id] = message;
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
