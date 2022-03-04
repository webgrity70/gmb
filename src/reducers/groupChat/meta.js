// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import {
  connectSocketSucceeded,
  disconnectSocketSucceeded,
  resetThread,
  leaveChat,
} from '../../Actions/action_group_chat';
import { logout } from '../../Actions/actions_user';

const initialState = {};
const initialGroupState = { socketOnline: false, lastReadMessage: null };
const reducer = createReducer(initialState, {
  [connectSocketSucceeded]: (state, action) => {
    const { groupId } = action.payload;
    const group = state[groupId] || initialGroupState;
    group.socketOnline = true;
    state[groupId] = group;
  },
  [disconnectSocketSucceeded]: (state, action) => {
    const { groupId } = action.payload;
    const group = state[groupId] || initialGroupState;
    group.socketOnline = false;
    state[groupId] = group;
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
