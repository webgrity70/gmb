import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import { fetchPsychology } from '../../Actions/actions_profile';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchPsychology.succeeded]: (state, action) => {
    const psychology = action.payload.results.map((e) => ({
      maxValue: e.max,
      minValue: e.min,
      identifier: e.identifier,
      label: e.question,
    }));
    return keyBy(psychology, 'identifier');
  },
});

export default reducer;
