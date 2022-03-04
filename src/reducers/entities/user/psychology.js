// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import {
  fetchUserPsychology,
  updateUserPsychology,
} from '../../../Actions/actions_profile';
import * as userActions from '../../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchUserPsychology.succeeded]: (state, action) => {
    const { userId, data } = action.payload;
    state[userId] = data;
  },
  [updateUserPsychology.succeeded]: (state, action) => {
    const { userId, body } = action.payload;
    state[userId] = body;
  },
  [userActions.logout]: () => initialState,
});

export default reducer;
