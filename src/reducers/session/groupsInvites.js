import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import * as userActions from '../../Actions/actions_user';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {};
const reducer = createReducer(initialState, {
  [userActions.fetchGroupsInvitesSucceeded]: (state, action) => {
    const results = keyBy(
      action.payload.results,
      (e) => `${e.id}-${e.invitedUser.id}-${e.invitedBy.id}`
    );
    return { ...state, ...results };
  },
  [groupsActions.acceptInvitation.succeeded]: (state, action) => {
    const { key } = action.payload;
    const invitation = state[key];
    if (invitation) {
      invitation.status = 'Accepted';
    }
  },
  [groupsActions.rejectInvitation.succeeded]: (state, action) => {
    const { key } = action.payload;
    const invitation = state[key];
    if (invitation) {
      invitation.status = 'Declined';
    }
  },
  [userActions.logout.type]: () => initialState,
});

export default reducer;
