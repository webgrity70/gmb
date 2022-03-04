import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  count: 0,
  next: null,
  previous: null,
  order: null,
  input: null,
  filters: {},
};

const reducer = createReducer(initialState, {
  [groupsActions.fetchGroupSucceeded.type]: () => initialState,
  [groupsActions.changeMembersOrder]: (state, { payload: order }) => {
    const newOrder = order === state.order ? `-${order}` : order;
    return {
      ...state,
      next: null,
      previous: null,
      order: newOrder,
    };
  },
  [groupsActions.changeMembersFilter]: (state, { payload: filter }) => {
    const base = {
      next: null,
      previous: null,
    };
    const key = Object.keys(filter)[0]; // This function receives always only one property
    const elementValue = filter[key];

    if (Array.isArray(elementValue)) {
      const realValue = elementValue[0]; // If arrays receives always only one element
      const previousArray = state.filters[key] || [];
      const valueInside = previousArray
        ? previousArray.includes(realValue)
        : null;
      return {
        ...base,
        filters: {
          ...state.filters,
          [key]: valueInside
            ? previousArray.filter((e) => e !== realValue)
            : [...previousArray, realValue],
        },
      };
    }
    const exist = Object.keys(state.filters).find((e) => e === key);
    const oldValue = exist ? state.filters[key] : null;
    const shouldRemove = exist && elementValue === oldValue;
    const filters = shouldRemove
      ? omit(state.filter, key)
      : { ...state.filters, ...filter };
    return { ...base, filters };
  },
  [groupsActions.changeMembersSearch]: (state, { payload: search }) => ({
    ...state,
    next: null,
    previous: null,
    input: search,
  }),
  [groupsActions.fetchMembersSucceeded]: (state, { payload }) => {
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
