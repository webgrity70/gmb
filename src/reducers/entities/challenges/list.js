import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import * as challengesActions from '../../../Actions/actions_challenges';

const initialState = {};
const reducer = createReducer(initialState, {
  [challengesActions.fetchChallengesSucceeded.type]: (state, action) => ({
    ...state,
    ...keyBy(action.payload.results, 'id'),
  }),
  [challengesActions.fetchFlashChallenges.succeeded]: (state, action) => ({
    ...state,
    ...keyBy(action.payload.results, 'id'),
  }),
  [challengesActions.removeOnGoing.type]: (state, { payload }) => ({
    ...omit(state, payload),
  }),
  [challengesActions.leaveChallenge.succeeded]: (state, { payload }) => {
    const challenge = state[payload.challengeId];
    if (!challenge) return state;
    return {
      ...state,
      [payload.challengeId]: {
        ...challenge,
        joinedAt: null,
        participants: challenge.participants - 1,
      },
    };
  },
  [challengesActions.createPlanJoinFlashChallenge.succeeded]: (
    state,
    { payload }
  ) => {
    const challenge = state[payload.challengeId];
    if (!challenge) return state;
    return {
      ...state,
      [payload.challengeId]: {
        ...challenge,
        joinedAt: new Date().toISOString(),
        participants: get(challenge, 'participants', 1) + 1,
      },
    };
  },
  [challengesActions.deleteChallenge.succeeded]: (state, { payload }) =>
    omit(state, payload.challengeId),
});

export default reducer;
