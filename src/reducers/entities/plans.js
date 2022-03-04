import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import * as plansActions from '../../Actions/actions_plan';

const initialState = {};
const reducer = createReducer(initialState, {
  [plansActions.fetchPlan.succeeded]: (state, action) => ({
    ...state,
    [action.payload.id]: action.payload,
  }),
  [plansActions.deletePlan.succeeded]: (state, { payload: { id } }) =>
    omit(state, id),
});

export default reducer;
