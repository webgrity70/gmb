import { createReducer } from 'redux-starter-kit';
import * as userActions from '../../Actions/actions_user';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [userActions.fetchGroupsInvitesStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [userActions.fetchGroupsInvitesSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [[userActions.fetchGroupsInvitesFailed.type]]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
