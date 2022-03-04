import { createReducer } from 'redux-starter-kit';
import * as planActions from '../../Actions/actions_plan';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [planActions.createEvent.started]: () => ({
    error: null,
    loading: true,
  }),
  [planActions.createEvent.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [planActions.createEvent.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
