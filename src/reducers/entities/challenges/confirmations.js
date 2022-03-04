import { createReducer } from 'redux-starter-kit';
import moment from 'moment-timezone';
import * as challengesActions from '../../../Actions/actions_challenges';

const initialState = {};
const reducer = createReducer(initialState, {
  [challengesActions.fetchChallengeConfirmations.succeeded]: (
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
    const confirmations = state[payload.challengeId];
    if (!confirmations) return state;
    return {
      ...state,
      [payload.challengeId]: [
        ...confirmations,
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
