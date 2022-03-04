// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import * as profileActions from '../Actions/actions_profile';

const initialState = {
  loading: false,
  error: null,
};

const reducer = createReducer(initialState, {
  [profileActions.fetchUserAbout.started]: (state) => {
    state.loading = true;
    state.error = null;
  },
  [profileActions.fetchUserAbout.succeeded]: (state) => {
    state.loading = false;
    state.error = null;
  },
  [profileActions.fetchUserAbout.failed]: (state, { payload }) => {
    state.loading = false;
    state.error = payload.error;
  },
});

export default reducer;
