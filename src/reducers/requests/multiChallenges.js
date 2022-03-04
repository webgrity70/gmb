import { createReducer } from 'redux-starter-kit';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {
  loading: [],
  loaded: [],
  errors: {},
};
const reducer = createReducer(initialState, {
  [challengeActions.fetchChallengeDetails.started]: (state, action) => {
    const id = action.payload[0];
    return {
      ...state,
      loading: [...state.loading, id],
    };
  },
  [challengeActions.fetchChallengeDetails.succeeded]: (state, action) => ({
    ...state,
    loading: state.loading.filter((e) => e !== action.payload.id),
    loaded: [...state.loaded, action.payload.id],
  }),
  [challengeActions.fetchChallengeDetails.failed]: (state, action) => ({
    ...state,
    loading: state.loading.filter((e) => e !== action.payload.id),
    loaded: [...state.loaded, action.payload.id],
    errors: { ...state.errors, [action.payload.id]: action.payload },
  }),
});

export default reducer;
