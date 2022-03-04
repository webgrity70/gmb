import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import * as profileActions from '../../Actions/actions_profile';

const initialState = {};
const reducer = createReducer(initialState, {
  [profileActions.fetchAppsSucceeded]: (state, action) =>
    keyBy(action.payload, 'id'),
});

export default reducer;
