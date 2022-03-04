import { createReducer } from 'redux-starter-kit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [groupsActions.fetchPostsStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [groupsActions.fetchNextPostsSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [groupsActions.fetchPostsSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [groupsActions.fetchPostsFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
