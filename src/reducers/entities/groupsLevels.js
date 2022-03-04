import { createReducer } from 'redux-starter-kit';

import keyBy from 'lodash/keyBy';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {};
const reducer = createReducer(initialState, {
  [groupsActions.fetchGroupsLevelsSucceeded]: (state, action) => ({
    ...state,
    ...keyBy(action.payload.result, 'level'),
  }),
});

export default reducer;
