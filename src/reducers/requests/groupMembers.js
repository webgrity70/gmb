import { createReducer } from 'redux-starter-kit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [groupsActions.fetchGroupStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [groupsActions.fetchGroupSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [groupsActions.fetchGroupFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
