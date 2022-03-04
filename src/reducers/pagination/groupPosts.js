import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  count: 0,
  next: null,
  previous: null,
};

const reducer = createReducer(initialState, {
  [groupsActions.fetchPostsSucceeded.type]: (state, { payload }) => {
    const res = omit(payload, 'results');
    const previous = state.previous && payload.previous ? state.next : 1;
    const next = res.next ? previous + 1 : null;
    return {
      ...res,
      previous,
      next,
    };
  },
  [groupsActions.resetPostsPagination.type]: () => initialState,
  [groupsActions.fetchNextPostsSucceeded.type]: (state, { payload }) => {
    const res = omit(payload, 'results');
    const previous = state.previous && payload.previous ? state.next : 1;
    const next = res.next ? previous + 1 : null;
    return {
      ...state,
      ...res,
      previous,
      next,
    };
  },
});

export default reducer;
