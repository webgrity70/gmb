import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import * as planActions from '../../Actions/actions_plan';

const initialState = {
  count: 0,
  next: null,
  previous: null,
  input: null,
  filters: {},
  pagination: [],
};

const reducer = createReducer(initialState, {
  [planActions.resetGTPagination]: () => initialState,
  [planActions.changeGTFilter]: (state, { payload: filter }) => {
    const key = Object.keys(filter)[0]; // This function receives always only one property
    const elementValue = filter[key];

    if (Array.isArray(elementValue)) {
      const realValue = elementValue[0]; // If arrays receives always only one element
      const previousArray = state.filters[key] || [];
      const valueInside = previousArray
        ? previousArray.includes(realValue)
        : null;
      return {
        ...state,
        next: null,
        previous: null,
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
    return { ...state, filters };
  },
  [planActions.changeGTSearch]: (state, { payload: search }) => ({
    ...state,
    next: null,
    previous: null,
    input: search,
  }),
  [planActions.fetchGlobalTemplatesSucceeded]: (state, { payload }) => {
    const res = omit(payload, 'results');
    const ids = payload.results.map(({ id }) => id);
    return {
      ...state,
      ...res,
      pagination: res.previous ? [...state.pagination, ...ids] : ids,
    };
  },
});

export default reducer;
