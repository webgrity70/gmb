import { createReducer } from 'redux-starter-kit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  loading: [],
  loaded: [],
  errors: {},
};
const reducer = createReducer(initialState, {
  [groupsActions.fetchGroupStarted]: (state, action) => ({
    ...state,
    loading: [...state.loading, action.payload.id],
  }),
  [groupsActions.fetchGroupSucceeded]: (state, action) => ({
    ...state,
    loading: state.loading.filter((e) => e !== action.payload.id),
    loaded: [...state.loaded, action.payload.id],
  }),
  [groupsActions.fetchGroupFailed]: (state, action) => ({
    ...state,
    loading: state.loading.filter((e) => e !== action.payload.id),
    loaded: [...state.loaded, action.payload.id],
    errors: { ...state.errors, [action.payload.id]: action.payload },
  }),
});

export default reducer;
