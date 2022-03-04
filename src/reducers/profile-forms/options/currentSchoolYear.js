import { createReducer } from 'redux-starter-kit';
import { fetchCurrentSchoolYearOptions } from '../../../Actions/action_profile_forms';

const initialState = null;
const reducer = createReducer(initialState, {
  [fetchCurrentSchoolYearOptions.succeeded]: (state, action) => action.payload,
});

export default reducer;
