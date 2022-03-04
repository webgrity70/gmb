/* eslint-disable prefer-destructuring */
import { createReducer } from 'redux-starter-kit';
import * as plansActions from '../../Actions/actions_plan';

const initialState = {};
const reducer = createReducer(initialState, {
  [plansActions.fetchEventDetails.succeeded.type]: (state, { payload }) => {
    const id = payload.id;
    return {
      ...state,
      [id]: payload,
    };
  },
});

export default reducer;
