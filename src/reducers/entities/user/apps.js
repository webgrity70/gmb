// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import {
  fetchUserApps,
  updateUserApps,
} from '../../../Actions/actions_profile';
import * as userActions from '../../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchUserApps.succeeded]: (state, action) => {
    const { userId, data } = action.payload;
    state[userId] = data;
  },
  [updateUserApps.succeeded]: (state, action) => {
    const { userId, body } = action.payload;
    state[userId] = body;
  },
  [userActions.logout]: () => initialState,
});

export default reducer;
