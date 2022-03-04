// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import {
  fetchUserInformation,
  updateLanguagesSucceeded,
} from '../../../Actions/actions_profile';
import * as userActions from '../../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchUserInformation.succeeded]: (state, action) => {
    const { userId, data } = action.payload;
    state[userId] = data;
  },
  [updateLanguagesSucceeded]: (state, action) => {
    const { userId, languages } = action.payload;
    if (state[userId]) {
      state[userId].languages = languages;
    }
  },
  [userActions.logout]: () => initialState,
});

export default reducer;
