import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import * as groupsActions from '../../Actions/actions_groups';

const initialState = {
  count: 0,
  next: null,
  previous: null,
  order: '-member_count',
  pagination: [],
  q: null,
  shouldResetPagination: false,
  filters: {},
};

const reducer = createReducer(initialState, {
  [groupsActions.changeFilterSuccess]: (state, { payload: { filter } }) => {
    const base = { ...state, shouldResetPagination: true };
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
  [groupsActions.changeOrderSuccess]: (state, { payload: { order } }) => {
    const newOrder = order === state.order ? `-${order}` : order;
    return {
      ...state,
      order: newOrder,
      shouldResetPagination: true,
    };
  },
  [groupsActions.changeSearchSuccess]: (state, { payload: { search } }) => ({
    ...state,
    q: search,
    shouldResetPagination: true,
  }),
  [groupsActions.fetchGroups.succeeded]: (state, { payload }) => {
    const res = omit(payload, 'results');
    const previous = state.previous && payload.previous ? state.next : 1;
    const next = res.next ? previous + 1 : null;
    const newEntries = payload.results.map((e) => e.id);
    return {
      ...state,
      ...res,
      pagination: state.shouldResetPagination
        ? newEntries
        : uniq([...state.pagination, ...newEntries]),
      previous,
      shouldResetPagination: false,
      next,
    };
  },
});

export default reducer;
