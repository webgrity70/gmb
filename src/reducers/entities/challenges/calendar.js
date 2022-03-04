import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import get from 'lodash/get';
import {
  fetchCalendarPlan,
  deleteChallenge,
} from '../../../Actions/actions_challenges';
import { logout } from '../../../Actions/actions_user';

const initialState = {};
const reducer = createReducer(initialState, {
  [fetchCalendarPlan.succeeded.type]: (state, { payload }) => ({
    ...state,
    [payload.challengeId]: {
      ...get(state, payload.challengeId, {}),
      ...keyBy(payload.data, 'templateID'),
    },
  }),
  [deleteChallenge.succeeded]: (state, { payload }) =>
    omit(state, payload.challengeId),
  [logout.type]: () => initialState,
});

export default reducer;
