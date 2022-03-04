import { createReducer } from 'redux-starter-kit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  loading: false,
  loaded: false,
  error: null,
};

const reducer = createReducer(initialState, {
  [groupsActions.fetchGroupTemplates.started]: () => ({
    error: null,
    loading: true,
    loaded: false,
  }),
  [groupsActions.fetchGroupTemplates.succeeded]: () => ({
    error: null,
    loading: false,
    loaded: true,
  }),
  [groupsActions.fetchGroupTemplates.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
    loaded: true,
  }),
});

export default reducer;
