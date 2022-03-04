import { createReducer } from 'redux-starter-kit';
import * as profileActions from '../../Actions/actions_profile';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [profileActions.fetchMyGroupsStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [profileActions.fetchMyGroupsSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [profileActions.fetchMyGroupsFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
