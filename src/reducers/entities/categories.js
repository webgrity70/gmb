import { createReducer } from 'redux-starter-kit';

import keyBy from 'lodash/keyBy';
import { fetchCategories } from '../../Actions/actions_groups';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchCategories.succeeded]: (state, action) => ({
    ...state,
    ...keyBy(action.payload, 'pk'),
  }),
});

export default reducer;
