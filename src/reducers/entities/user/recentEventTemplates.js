// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import * as userActions from '../../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [userActions.fetchRecentEventTemplatesAction.succeeded]: (state, action) => {
    const { userId, data } = action.payload;
    state[userId] = data;
  },
  [userActions.logout]: () => initialState,
});

export default reducer;
