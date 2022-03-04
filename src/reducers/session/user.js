import { createReducer } from 'redux-starter-kit';
import * as userActions from '../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [userActions.fetchUserData.succeeded]: (state, action) => ({
    pk: action.payload.pk,
    name: action.payload.name,
  }),
  [userActions.logout]: () => initialState,
});

export default reducer;
