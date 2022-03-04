import { createReducer } from 'redux-starter-kit';
import * as profileActions from '../../Actions/actions_profile';

const initialState = {
  loading: [],
  loaded: [],
  errors: {},
};
const reducer = createReducer(initialState, {
  [profileActions.fetchUserInformation.started]: (state, action) => {
    const id = action.payload[0];
    return {
      ...state,
      loading: [...state.loading, id],
    };
  },
  [profileActions.fetchUserInformation.succeeded]: (state, action) => ({
    ...state,
    loading: state.loading.filter((e) => e !== action.payload.userId),
    loaded: [...state.loaded, action.payload.userId],
  }),
  [profileActions.fetchUserInformation.failed]: (state, action) => ({
    ...state,
    loading: state.loading.filter((e) => e !== action.payload.userId),
    loaded: [...state.loaded, action.payload.userId],
    errors: { ...state.errors, [action.payload.userId]: action.payload },
  }),
});

export default reducer;
