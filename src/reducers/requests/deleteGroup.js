import { createReducer } from 'redux-starter-kit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [groupsActions.deleteGroup.started]: () => ({
    error: null,
    loading: true,
  }),
  [groupsActions.deleteGroup.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [groupsActions.deleteGroup.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
