// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import { fetchUserCategories } from '../../../Actions/actions_profile';
import * as userActions from '../../../Actions/actions_user';
import { buddyHasAccepted } from '../../../Actions/action_buddy_request';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchUserCategories.succeeded]: (state, action) => {
    const { userId, data } = action.payload;
    state[userId] = data;
  },
  [userActions.logout]: () => initialState,
  [buddyHasAccepted.type]: (state, action) => {
    const {
      myUserId,
      category: { pk: catPk },
      participantA,
      participantB,
    } = action.payload;
    if (state[myUserId]) {
      const catIndex = state[myUserId].findIndex((e) => e.id === catPk);
      const category = state[myUserId][catIndex];
      state[myUserId][catIndex] = {
        ...category,
        buddy: participantA.id === myUserId ? participantB : participantA,
      };
    }
  },
});

export default reducer;
