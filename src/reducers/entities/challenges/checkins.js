import { createReducer } from 'redux-starter-kit';
import moment from 'moment-timezone';
import * as challengesActions from '../../../Actions/actions_challenges';

const initialState = {};
const reducer = createReducer(initialState, {
  [challengesActions.fetchChallengeCheckins.succeeded]: (
    state,
    { payload }
  ) => ({
    ...state,
    [payload.challengeId]: payload.data.results,
  }),
  [challengesActions.createPlanJoinFlashChallenge.succeeded]: (
    state,
    { payload }
  ) => {
    const checkins = state[payload.challengeId];
    if (!checkins) return state;
    return {
      ...state,
      [payload.challengeId]: [
        ...checkins,
        {
          userName: payload.myUser.name,
          userID: payload.myUser.pk,
          timezoneName: moment.tz.guess(),
          value: null,
          note: null,
          date: null,
          xp: 0,
        },
      ],
    };
  },
});

export default reducer;
