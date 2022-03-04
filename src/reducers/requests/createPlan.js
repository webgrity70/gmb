import { createReducer } from 'redux-starter-kit';
import * as planActions from '../../Actions/actions_plan';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [planActions.createPlan.started]: () => ({
    error: null,
    loading: true,
  }),
  [planActions.createPlan.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [planActions.createPlan.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
