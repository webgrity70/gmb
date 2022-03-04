import { createReducer } from 'redux-starter-kit';
import { fetchEducationLevelOptions } from '../../../Actions/action_profile_forms';

const initialState = null;
const reducer = createReducer(initialState, {
  [fetchEducationLevelOptions.succeeded]: (state, action) => action.payload,
});

export default reducer;
