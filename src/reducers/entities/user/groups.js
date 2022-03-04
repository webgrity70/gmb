// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import {
  fetchUserGroupsSucceeded,
  updateUserGroups,
} from '../../../Actions/actions_profile';
import * as userActions from '../../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchUserGroupsSucceeded.type]: (state, action) => {
    const { userId, data } = action.payload;
    state[userId] = data;
  },
  [updateUserGroups.succeeded]: (state, action) => {
    const { userId, body } = action.payload;
    state[userId] = body;
  },
  [userActions.logout]: () => initialState,
});

export default reducer;
