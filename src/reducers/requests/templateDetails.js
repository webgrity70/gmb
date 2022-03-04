import { createReducer } from 'redux-starter-kit';
import * as planActions from '../../Actions/actions_plan';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [planActions.fetchTemplateDetails.started.type]: () => ({
    error: null,
    loading: true,
  }),
  [planActions.fetchTemplateDetails.succeeded.type]: () => ({
    error: null,
    loading: false,
  }),
  [planActions.fetchTemplateDetails.failed.type]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
