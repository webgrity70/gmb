import { createReducer } from 'redux-starter-kit';
import * as userActions from '../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [userActions.fetchUserSubscriptionSucceeded]: (state, action) =>
    action.payload,
  [userActions.logout]: () => initialState,
});

export default reducer;
