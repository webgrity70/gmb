import {
  CLEAR_INPUT,
  GET_FULL_NEWS,
  GET_NEWS_CONTINUATION,
  pages,
  SET_ACTIVE_PAGE,
  SET_FLITER,
  SET_INPUT,
  SET_NEWS_SINGLE,
  USE_ALT_PAGE,
} from '../constants';
import { setStep } from './actions_steps';
import NewsBoxService from '../Services/NewsBoxService';
import { notificationMessage } from './actions_notification';

function clearInput() {
  const action = {
    type: CLEAR_INPUT,
  };
  return action;
}

const limit = 10;
export function setFullNews(newsObj) {
  const action = {
    type: GET_FULL_NEWS,
    payload: newsObj,
  };
  return action;
}
export function setNewsContinuation(newsObj, page) {
  const action = {
    type: GET_NEWS_CONTINUATION,
    payload: newsObj,
    newsPage: page,
  };
  return action;
}

export function setActivePage(page) {
  const action = {
    type: SET_ACTIVE_PAGE,
    payload: page,
  };
  return action;
}

export function getFullNews() {
  return async (dispatch) => {
    const news = {};
    for (let i = 0; i < pages.length; i += 1) {
      if (pages[i] === 'upcoming') {
        news[pages[i]] = {};
      } else {
        try {
          // eslint-disable-next-line  no-await-in-loop
          news[pages[i]] = await NewsBoxService.getNewsPage(limit, pages[i]);
          // const { results } = news[pages[i]];
        } catch (e) {
          // TODO: Should this be executed in parallel?
          console.error(e);
        }
      }
    }
    dispatch(setFullNews(news));
    dispatch(
      setStep({ step_lvl_1: 0, step_lvl_2: 0, maxSteps_1: pages.length - 1 })
    );
  };
}
export function setNewsFilter(item) {
  return async (dispatch) => {
    dispatch({ type: SET_FLITER, payload: item });
  };
}

export function continueNewsFeed(page, url, next) {
  return async (dispatch) => {
    const newsObj = await NewsBoxService.getNewsPageContinuation(url);
    if (newsObj.results.length) {
      dispatch(setNewsContinuation(newsObj, page));
      dispatch(setStep({ step_lvl_2: next }));
    }
  };
}
export function setNewActivePage(page, next, isClicked = false) {
  return async (dispatch, getState) => {
    if (next === -1) {
      return dispatch(setActivePage(page));
    }
    const { news, steps } = getState();
    const filter = news.filter;
    const { step_lvl_1 } = steps;
    const newsItem = news.items[page];
    if (newsItem.results || page === 'upcoming') {
      if (
        page === 'upcoming' ||
        ((newsItem.results || []).length &&
          (!filter.includes(page) || isClicked))
      ) {
        dispatch(setStep({ step_lvl_1: next, step_lvl_2: 0 }));
        return dispatch(setActivePage(page));
      }
    }

    if (!isClicked) {
      let count = 0;
      let nextItem = next;
      while (count < pages.length) {
        if (nextItem < pages.length - 1) {
          nextItem++;
        } else {
          nextItem = 0;
        }
        if (!filter.includes(pages[nextItem])) {
          if (
            pages[nextItem] === 'upcoming' ||
            (news.items[pages[nextItem]].results &&
              news.items[pages[nextItem]].results.length)
          ) {
            if (step_lvl_1 !== nextItem) {
              dispatch(setStep({ step_lvl_1: nextItem, step_lvl_2: 0 }));
              dispatch(setActivePage(pages[nextItem]));
              return;
            }
          } else if (pages[nextItem]) {
            try {
              const newsObj = await NewsBoxService.getNewsPage(
                limit,
                pages[nextItem]
              );
              if (newsObj.results.length) {
                if (step_lvl_1 !== nextItem) {
                  dispatch(setStep({ step_lvl_1: nextItem, step_lvl_2: 0 }));
                  dispatch(setNewsContinuation(newsObj, pages[nextItem]));
                  dispatch(setActivePage(pages[nextItem]));
                  return;
                }
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
        count++;
      }
    }
  };
}

export function setAltPage(state) {
  return async (dispatch) => {
    dispatch({ type: USE_ALT_PAGE, payload: state });
  };
}
export function setInput(obj) {
  return async (dispatch) => {
    dispatch({ type: SET_INPUT, payload: obj });
  };
}
export function sendNews(page) {
  return async (dispatch, getState) => {
    const input = getState().news.inputs;
    let resp = {};
    if (input.shoutOut && page === 'shout-outs') {
      const changedInput = {
        ...input,
        text: input.shoutOut,
      };
      try {
        resp = await NewsBoxService.sendShoutOut(changedInput);
      } catch (error) {
        dispatch(notificationMessage(error.response.data.message, false));
      }
    } else if (input.quotes && page === 'quotes') {
      input.image = '';
      if (input.unknown) {
        input.by = 'Unknown';
      }
      const changedInput = {
        ...input,
        text: input.quotes,
      };
      try {
        resp = await NewsBoxService.sendQuote(changedInput);
      } catch (error) {
        dispatch(notificationMessage(error.message, false));
      }
    } else {
      return;
    }
    if (resp.status === 'success') {
      dispatch(notificationMessage(resp.message, true));
      try {
        const news = await NewsBoxService.getNewsPage(limit, page);
        dispatch({ type: SET_NEWS_SINGLE, newsPage: page, payload: news });
      } catch (e) {
        dispatch(notificationMessage(e.message, false));
      }
      dispatch(setAltPage(false));
      dispatch(clearInput());
    }
  };
}
