/* eslint-disable implicit-arrow-linebreak */
import { createReducer } from 'redux-starter-kit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = [];

const reducer = createReducer(initialState, {
  [groupsActions.changePPMStatus.started]: (state, { payload }) => [
    ...state,
    payload.userId,
  ],
  [groupsActions.changePPMStatus.succeeded]: (state, { payload }) =>
    state.filter((e) => e !== payload.userId),
  [groupsActions.changePPMStatus.failed]: (state, { payload }) =>
    state.filter((e) => e !== payload.userId),
});

export default reducer;
