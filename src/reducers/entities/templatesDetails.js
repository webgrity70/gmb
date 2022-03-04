// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import * as plansActions from '../../Actions/actions_plan';

const initialState = {};
const reducer = createReducer(initialState, {
  [plansActions.fetchTemplateDetails.succeeded]: (state, action) => {
    const { id, ...data } = action.payload;
    state[id] = { id, ...data };
  },
});

export default reducer;
