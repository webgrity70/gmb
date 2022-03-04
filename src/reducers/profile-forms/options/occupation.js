import { createReducer } from 'redux-starter-kit';
import { fetchOccupationOptions } from '../../../Actions/action_profile_forms';

const initialState = null;
const reducer = createReducer(initialState, {
  [fetchOccupationOptions.succeeded]: (state, action) => action.payload,
});

export default reducer;
