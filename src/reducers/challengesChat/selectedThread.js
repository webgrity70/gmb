// Reducer relies on immer
/* eslint-disable no-param-reassign */

import { createReducer } from 'redux-starter-kit';
import get from 'lodash/get';
import { logout } from '../../Actions/actions_user';
import {
  selectThread,
  showThreads,
  fetchChallengesThreadsSucceeded,
  leaveChat,
} from '../../Actions/actions_challenges_chat';
import { leaveChallenge } from '../../Actions/actions_challenges';

const initialState = null;
const reducer = createReducer(initialState, {
  [selectThread]: (state, action) =>
    get(action.payload, 'challengeId', initialState),
  [showThreads]: () => initialState,
  [leaveChallenge.succeeded]: (state, action) => {
    const { challengeId } = action.payload;
    if (state === challengeId) return null;
    return state;
  },
  [leaveChat.succeeded]: (state, action) => {
    const { challengeId } = action.payload;
    if (state === challengeId) return null;
    return state;
  },
  [fetchChallengesThreadsSucceeded.type]: (state, action) => {
    const isPaginationRequest = action.payload.previous;
    if (isPaginationRequest) return state;
    return action.payload.results.some((thread) => thread.id === state)
      ? state
      : state;
  },
  [logout]: () => initialState,
});

export default reducer;
