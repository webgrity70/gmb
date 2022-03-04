import {
  GET_FULL_NEWS,
  GET_NEWS_CONTINUATION,
  SET_ACTIVE_PAGE,
  SET_FLITER,
  USE_ALT_PAGE,
  SET_INPUT,
  CLEAR_INPUT,
  SET_NEWS_SINGLE,
  pages,
  pageTitles,
} from '../constants';

export default (
  state = {
    items: {
      announcements: {},
      hints: {},
      quotes: {},
      'shout-outs': {},
      upcoming: {},
    },
    hasNews: false,
    rotate: true,
    active: 'announcements',
    pages,
    pageTitles,
    filter: [],
    altpage: false,
    inputs: {},
  },
  action
) => {
  switch (action.type) {
    case GET_FULL_NEWS:
      state.items = { ...state.items, ...action.payload };
      state.hasNews = true;
      state.rotate = true;

      return state;
    case SET_NEWS_SINGLE:
      state.items[action.newsPage] = action.payload;
      return state;
    case GET_NEWS_CONTINUATION: {
      const previousState = state.items[action.newsPage];
      const prevResults = previousState ? previousState.results : [];
      const payloadResults =
        action.payload && action.payload.results ? action.payload.results : [];
      const items = {
        ...state.items,
        ...{
          [action.newsPage]: {
            ...state.items[action.newsPage],
            ...action.payload,
            results: [...prevResults, ...payloadResults],
          },
        },
      };
      return { ...state, items };
    }
    case SET_ACTIVE_PAGE:
      return { ...state, active: action.payload };
    case SET_FLITER:
      let filters = state.filter;
      if (filters.includes(action.payload)) {
        filters = filters.filter((item) => item !== action.payload);
      } else {
        filters.push(action.payload);
      }
      state.filter = filters;
      return state;
    case USE_ALT_PAGE:
      return { ...state, altpage: !state.altpage };
    case SET_INPUT:
      let inputs = state.inputs;
      inputs = { ...inputs, ...action.payload };
      return { ...state, inputs };
    case CLEAR_INPUT:
      state.inputs = {};

      return { ...state };
    default:
      return state;
  }
};
