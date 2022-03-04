// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import {
  fetchUserAbout,
  updateAboutSucceeded,
  updateOccupationSucceeded,
} from '../../../Actions/actions_profile';
import * as userActions from '../../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchUserAbout.succeeded]: (state, action) => {
    const { userId, data } = action.payload;
    state[userId] = data;
  },
  [updateAboutSucceeded]: (state, action) => {
    const { userId, about } = action.payload;
    if (state[userId]) {
      state[userId] = {
        ...state[userId],
        ...about,
      };
    }
  },
  [updateOccupationSucceeded]: (state, action) => {
    const {
      userId,
      occupation: { occupations, ...occupationData },
    } = action.payload;
    if (state[userId]) {
      state[userId] = {
        ...state[userId],
        ...occupationData,
        occupation: occupations,
      };
    }
  },
  [userActions.logout]: () => initialState,
});

export default reducer;
