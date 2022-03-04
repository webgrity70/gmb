import { createReducer } from 'redux-starter-kit';

import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {};
const reducer = createReducer(initialState, {
  [groupsActions.fetchGroups.succeeded]: (state, action) => ({
    ...state,
    ...keyBy(action.payload.results, 'id'),
  }),
  [groupsActions.fetchGroupSucceeded]: (state, action) => ({
    ...state,
    [action.payload.id]: omit(action.payload, 'members', 'announcements'),
  }),
  [groupsActions.joinGroupSucceeded]: (
    state,
    { payload: { groupId, userPermission } }
  ) => ({
    ...state,
    [groupId]: { ...state[groupId], userPermission },
  }),
  [groupsActions.leaveGroupSucceeded]: (state, { payload: { groupId } }) => ({
    ...state,
    [groupId]: { ...state[groupId], userPermission: null },
  }),
  [groupsActions.deleteGroup.succeeded]: (state, { payload: { groupId } }) =>
    omit(state, groupId),
});

export default reducer;
