import { createReducer } from 'redux-starter-kit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [groupsActions.createAnnouncementStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [groupsActions.createAnnouncementSucceded.type]: () => ({
    error: null,
    loading: false,
  }),
  [groupsActions.createAnnouncementFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
