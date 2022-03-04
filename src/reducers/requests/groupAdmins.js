import { createReducer } from 'redux-starter-kit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [groupsActions.fetchGroupAdmins.started]: () => ({
    error: null,
    loading: true,
  }),
  [groupsActions.fetchGroupAdmins.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [groupsActions.fetchGroupAdmins.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
