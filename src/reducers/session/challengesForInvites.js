import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import { fetchChallengesForInvitesSucceeded } from '../../Actions/actions_challenges';
import { logout } from '../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchChallengesForInvitesSucceeded.type]: (state, action) => ({
    ...state,
    ...keyBy(action.payload.results, 'id'),
  }),
  [logout]: () => initialState,
});

export default reducer;
