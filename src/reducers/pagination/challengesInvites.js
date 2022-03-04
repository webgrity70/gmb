import { createReducer } from 'redux-starter-kit';
import * as userActions from '../../Actions/actions_user';

const initialState = {
  next: null,
  previous: null,
};

const reducer = createReducer(initialState, {
  [userActions.fetchChallengesInvitesSucceeded.type]: (state, action) => ({
    next: action.payload.next,
    previous: action.payload.previous,
  }),
});

export default reducer;
