import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import * as profileActions from '../../Actions/actions_profile';
import { logout } from '../../Actions/actions_user';
import { leaveGroupSucceeded, deleteGroup } from '../../Actions/actions_groups';

const initialState = {};
const reducer = createReducer(initialState, {
  [profileActions.fetchMyGroupsSucceeded.type]: (state, action) => {
    const results = keyBy(action.payload.data.results, 'id');
    return { ...state, ...results };
  },
  [leaveGroupSucceeded]: (state, action) => omit(state, action.payload.groupId),
  [deleteGroup.succeeded]: (state, { payload: { groupId } }) =>
    omit(state, groupId),
  [logout.type]: () => initialState,
});

export default reducer;
