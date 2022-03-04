// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import {
  connectSocketSucceeded,
  disconnectSocketSucceeded,
  resetThread,
  leaveChat,
} from '../../Actions/actions_challenges_chat';
import { leaveChallenge } from '../../Actions/actions_challenges';
import { logout } from '../../Actions/actions_user';

const initialState = {};
const initialGroupState = { socketOnline: false, lastReadMessage: null };
const reducer = createReducer(initialState, {
  [connectSocketSucceeded]: (state, action) => {
    const { challengeId } = action.payload;
    const group = state[challengeId] || initialGroupState;
    group.socketOnline = true;
    state[challengeId] = group;
  },
  [disconnectSocketSucceeded]: (state, action) => {
    const { challengeId } = action.payload;
    const group = state[challengeId] || initialGroupState;
    group.socketOnline = false;
    state[challengeId] = group;
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
