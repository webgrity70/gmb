import { createReducer } from 'redux-starter-kit';
import { logout } from '../../Actions/actions_user';
import { setDraftPlan } from '../../Actions/actions_plan';

const initialState = null;
const reducer = createReducer(initialState, {
  [setDraftPlan]: (state, { payload }) => payload,
  [logout.type]: () => initialState,
});

export default reducer;
