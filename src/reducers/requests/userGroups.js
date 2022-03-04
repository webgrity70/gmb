import { createReducer } from 'redux-starter-kit';
import * as profileActions from '../../Actions/actions_profile';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [profileActions.fetchUserGroupsStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [profileActions.fetchUserGroupsSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [profileActions.fetchUserGroupsFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
