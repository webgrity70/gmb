import { createReducer } from 'redux-starter-kit';
import { omit, get } from 'lodash';
import * as groupsActions from '../../Actions/actions_groups';

//
//     count: 0,
//     next: null,
//     previous: null,
const initialState = {};

const reducer = createReducer(initialState, {
  [groupsActions.fetchPostResponsesSucceeded.type]: (state, { payload }) => {
    const { postId, data } = payload;
    const res = omit(data, 'results');
    const previous =
      get(state, postId, {}).previous && data.previous ? state[postId].next : 1;
    const next = res.next ? previous + 1 : null;
    return {
      ...state,
      [postId]: {
        ...get(state, postId, {}),
        ...res,
        previous,
        next,
      },
    };
  },
});

export default reducer;
