import { createReducer } from 'redux-starter-kit';
import * as chatActions from '../../Actions/action_chat';

const initialState = {
  loading: false,
  error: null,
};
const reducer = createReducer(initialState, {
  [chatActions.fetchThreads.started]: () => ({
    error: null,
    loading: true,
  }),
  [chatActions.fetchThreads.succeeded]: () => ({
    error: null,
    loading: false,
  }),
  [chatActions.fetchThreads.failed]: (state, action) => ({
    error: action.payload,
    loading: false,
  }),
});

export default reducer;
