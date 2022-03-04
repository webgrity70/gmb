import { createReducer } from 'redux-starter-kit';
import { logout } from '../../Actions/actions_user';
import { fetchPlanWindow } from '../../Actions/actions_plan';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchPlanWindow.succeeded]: (state, { payload }) => payload,
  [logout.type]: () => initialState,
});

export default reducer;
