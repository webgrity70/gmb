import { createReducer } from 'redux-starter-kit';
import uniq from 'lodash/uniq';
import {
  fetchChallengesForInvitesSucceeded,
  fetchChallengesForInvitesFailed,
} from '../../Actions/actions_challenges';

const initialState = {
  next: null,
  previous: null,
  pagination: [],
};

const reducer = createReducer(initialState, {
  [fetchChallengesForInvitesSucceeded.type]: (state, { payload }) => {
    const newEntries = payload.results.map((e) => e.id);
    return {
      ...state,
      next: payload.next,
      previous: payload.previous,
      pagination: payload.previous
        ? uniq([...state.pagination, ...newEntries])
        : newEntries,
    };
  },
  [fetchChallengesForInvitesFailed]: (state) => ({
    ...initialState,
    pagination: state.pagination,
  }),
});

export default reducer;
