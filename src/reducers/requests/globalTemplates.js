import { createReducer } from 'redux-starter-kit';
import * as planActions from '../../Actions/actions_plan';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [planActions.fetchGlobalTemplatesStarted.type]: () => ({
    error: null,
    loading: true,
  }),
  [planActions.fetchGlobalTemplatesSucceeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [planActions.fetchGlobalTemplatesFailed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
