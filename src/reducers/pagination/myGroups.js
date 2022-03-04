import { createReducer } from 'redux-starter-kit';
import * as profileActions from '../../Actions/actions_profile';
import { logout } from '../../Actions/actions_user';

const initialState = {
  next: undefined,
  previous: undefined,
  count: 0,
};
const reducer = createReducer(initialState, {
  [profileActions.fetchMyGroupsSucceeded.type]: (state, action) => {
    const { next, previous, count } = action.payload.data;
    return { next, previous, count };
  },
  [logout.type]: () => initialState,
});

export default reducer;
