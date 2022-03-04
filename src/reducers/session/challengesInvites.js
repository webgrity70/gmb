import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import * as userActions from '../../Actions/actions_user';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {};
const reducer = createReducer(initialState, {
  [userActions.fetchChallengesInvitesSucceeded]: (state, action) => {
    const results = keyBy(
      action.payload.results,
      (e) => `${e.id}-${e.invitedUser.id}-${e.invitedBy.id}`
    );
    return { ...state, ...results };
  },
  [challengeActions.acceptInvitation.succeeded]: (state, action) => {
    const { key } = action.payload;
    const invitation = state[key];
    if (invitation) {
      invitation.status = 'Accepted';
    }
  },
  [challengeActions.rejectInvitation.succeeded]: (state, action) => {
    const { key } = action.payload;
    const invitation = state[key];
    if (invitation) {
      invitation.status = 'Declined';
    }
  },
  [userActions.logout.type]: () => initialState,
});

export default reducer;
