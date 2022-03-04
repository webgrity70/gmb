import { createReducer } from 'redux-starter-kit';

const initialState = { freshTokenPromise: null };
const reducer = createReducer(initialState, {
  AUTH_DONE_REFRESHING_TOKEN: () => ({ freshTokenPromise: null }),
  AUTH_REFRESHING_TOKEN: (state, { freshTokenPromise }) => ({
    freshTokenPromise,
  }),
});

export default reducer;
