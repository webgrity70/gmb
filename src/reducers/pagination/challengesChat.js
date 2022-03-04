import { createReducer } from 'redux-starter-kit';
import * as challengesChatActions from '../../Actions/actions_challenges_chat';

const initialState = {
  next: null,
  previous: null,
};

const reducer = createReducer(initialState, {
  [challengesChatActions.fetchChallengesThreadsSucceeded.type]: (
    state,
    action
  ) => ({
    next: action.payload.next,
    previous: action.payload.previous,
  }),
});

export default reducer;
