// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import * as userActions from '../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [userActions.getNotificationSettings.succeeded]: (state, action) =>
    action.payload,
  [userActions.fetchUserNotifications.succeeded]: (state, action) =>
    action.payload,
  [userActions.updateUserNotifications.succeeded]: (state, { payload }) => {
    // Need to change the API to improve this.
    const section = payload[0][0];
    const option = section.options[0];
    state[section.key][option.key] = option.value;
  },
});

export default reducer;
