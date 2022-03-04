// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import { logout } from '../../Actions/actions_user';
import {
  fetchGroupsThreadsSucceeded,
  muteChat,
  setLastReadMessage,
  notifyMessageReceived,
  leaveChat,
  joinChatSucceeded,
  fetchJoinableGroupsThreadsSucceeded,
} from '../../Actions/action_group_chat';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchGroupsThreadsSucceeded.type]: (state, action) => ({
    ...state,
    ...keyBy(action.payload.results, 'id'),
  }),
  [fetchJoinableGroupsThreadsSucceeded.type]: (state, action) => {
    const data = action.payload.results.map((e) => ({ ...e, canJoin: true }));
    return {
      ...state,
      ...keyBy(data, 'id'),
    };
  },
  [logout]: () => initialState,
  [setLastReadMessage]: (state, action) => {
    const { groupId } = action.payload;
    const group = state[groupId];
    if (group) {
      group.unreadMessages = 0;
    }
  },
  [notifyMessageReceived]: (state, action) => {
    const { groupId } = action.payload;
    const group = state[groupId];
    if (group) {
      group.unreadMessages += 1;
    }
  },
  [muteChat.succeeded]: (state, action) => {
    const { groupId, muted } = action.payload;
    const group = state[groupId];
    if (group) {
      group.muted = !muted;
    }
  },
  [leaveChat.succeeded]: (state, action) => {
    const { groupId } = action.payload;
    return omit(state, groupId);
  },
  [joinChatSucceeded]: (state, action) => {
    const { groupId } = action.payload;
    const group = state[groupId];
    if (group) {
      group.canJoin = undefined;
    }
  },
});

export default reducer;
