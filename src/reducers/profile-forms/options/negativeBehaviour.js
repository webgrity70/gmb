import { createReducer } from 'redux-starter-kit';
import { fetchNegativeBehaviourOptions } from '../../../Actions/action_profile_forms';

const initialState = null;
const reducer = createReducer(initialState, {
  [fetchNegativeBehaviourOptions.succeeded]: (state, action) => action.payload,
});

export default reducer;
