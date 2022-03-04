// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import { logout } from '../../Actions/actions_user';
import {
  fetchChallengesThreadsSucceeded,
  muteChat,
  setLastReadMessage,
  leaveChat,
  notifyMessageReceived,
} from '../../Actions/actions_challenges_chat';
import { leaveChallenge } from '../../Actions/actions_challenges';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchChallengesThreadsSucceeded.type]: (state, action) => ({
    ...state,
    ...keyBy(action.payload.results, 'id'),
  }),
  [logout]: () => initialState,
  [setLastReadMessage]: (state, action) => {
    const { challengeId } = action.payload;
    const group = state[challengeId];
    if (group) {
      group.unreadMessages = 0;
    }
  },
  [notifyMessageReceived]: (state, action) => {
    const { challengeId } = action.payload;
    const group = state[challengeId];
    if (group) {
      group.unreadMessages += 1;
    }
  },
  [muteChat.succeeded]: (state, action) => {
    const { challengeId, muted } = action.payload;
    const group = state[challengeId];
    if (group) {
      group.muted = !muted;
    }
  },
  [leaveChat.succeeded]: (state, action) => {
    const { challengeId } = action.payload;
    return omit(state, challengeId);
  },
  [leaveChallenge.succeeded]: (state, action) => {
    const { challengeId } = action.payload;
    return omit(state, challengeId);
  },
});

export default reducer;
