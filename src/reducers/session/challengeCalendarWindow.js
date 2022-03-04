import { createReducer } from 'redux-starter-kit';
import { logout } from '../../Actions/actions_user';
import { fetchCalendarWindow } from '../../Actions/actions_challenges';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchCalendarWindow.succeeded]: (state, { payload }) => payload,
  [logout.type]: () => initialState,
});

export default reducer;
