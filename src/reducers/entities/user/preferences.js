// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import { fetchUserPreferences } from '../../../Actions/actions_profile';
import * as userActions from '../../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchUserPreferences.succeeded]: (state, action) => {
    const { userId, data } = action.payload;
    state[userId] = data;
  },
  [userActions.logout]: () => initialState,
});

export default reducer;
