import { createReducer } from 'redux-starter-kit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [groupsActions.fetchGroups.started]: () => ({
    error: null,
    loading: true,
  }),
  [groupsActions.fetchGroups.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [groupsActions.fetchGroups.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
