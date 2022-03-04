import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import get from 'lodash/get';
import moment from 'moment';
import * as challengesActions from '../../../Actions/actions_challenges';

const initialState = {};
const reducer = createReducer(initialState, {
  [challengesActions.fetchChallengeDetails.succeeded]: (state, { payload }) => {
    return {
      ...state,
      [payload.id]: {
        ...payload,
        challengeManager: payload.challengeManager || {},
      },
    };
  },
  [challengesActions.createPlanJoinRegularChallenge.succeeded]: (
    state,
    { payload }
  ) => ({
    ...state,
    [payload.challengeId]: {
      ...state[payload.challengeId],
      challengeJoinedDate: moment().format(),
      participants: state[payload.challengeId].participants + 1,
      chatJoined: true,
    },
  }),
  [challengesActions.renameChallenge.succeeded]: (state, { payload }) => ({
    ...state,
    [payload.challengeId]: {
      ...state[payload.challengeId],
      name: payload.name,
    },
  }),
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
  [challengesActions.changeLanguages.succeeded]: (state, { payload }) => ({
    ...state,
    [payload.challengeId]: {
      ...state[payload.challengeId],
      languages: payload.languages,
    },
  }),
  [challengesActions.changeLocation.succeeded]: (state, { payload }) => ({
    ...state,
    [payload.challengeId]: {
      ...state[payload.challengeId],
      location: payload.location.formattedAddress,
      locationID: payload.location.placeId,
      countryISO: payload.location.countryISO,
    },
  }),
  [challengesActions.leaveChallenge.succeeded]: (state, { payload }) => {
    const challenge = state[payload.challengeId];
    if (!challenge) return state;
    return {
      ...state,
      [payload.challengeId]: {
        ...challenge,
        ...(!!challenge.challengeManager &&
          payload.isOwner && { challengeManager: null }),
        challengeJoinedDate: null,
        joinedAt: null,
        participants: get(challenge, 'participants', 1) - 1,
        chatJoined: false,
      },
    };
  },
  [challengesActions.deleteChallenge.succeeded]: (state, { payload }) =>
    omit(state, payload.challengeId),
});

export default reducer;
