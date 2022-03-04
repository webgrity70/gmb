import { createReducer } from 'redux-starter-kit';
import * as userActions from '../../Actions/actions_user';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [userActions.fetchChallengesInvitesStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [userActions.fetchChallengesInvitesSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [[userActions.fetchChallengesInvitesFailed.type]]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
