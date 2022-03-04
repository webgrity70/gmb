import { createReducer } from 'redux-starter-kit';
import uniq from 'lodash/uniq';
import * as challengesActions from '../../Actions/actions_challenges';

const initialState = {
  next: null,
  previous: null,
  pagination: [],
};

const reducer = createReducer(initialState, {
  [challengesActions.fetchChallengesSucceeded.type]: (state, { payload }) => {
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
  [challengesActions.deleteChallenge.succeeded]: (state, { payload }) => ({
    ...state,
    pagination: state.pagination.filter((e) => e !== payload.challengeId),
  }),
  [challengesActions.fetchChallengesFailed]: (state) => ({
    ...initialState,
    pagination: state.pagination,
  }),
});

export default reducer;
