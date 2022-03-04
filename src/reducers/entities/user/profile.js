/* eslint-disable no-unused-vars */
// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import { fetchUserProfile } from '../../../Actions/actions_profile';
import * as userActions from '../../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchUserProfile.succeeded]: (state, action) => {
    const { data } = action.payload;
    state[data.pk] = data;
  },
  [userActions.fetchUserData.succeeded]: (state, { payload }) => ({
    ...state,
    ...(payload.pk && { [payload.pk]: payload }),
  }),
  [userActions.saveUserSettings.succeeded]: (state, { payload }) => {
    const { userId, message, status, ...settings } = payload;
    if (state[userId]) {
      Object.keys(settings).forEach((field) => {
        state[userId][field] = settings[field];
      });
    }
  },
  [userActions.logout]: () => initialState,
});

export default reducer;
