import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import * as profileActions from '../../Actions/actions_profile';

const initialState = {};
const reducer = createReducer(initialState, {
  [profileActions.fetchLanguagesSucceeded]: (state, action) =>
    keyBy(action.payload, 'value'),
});

export default reducer;
