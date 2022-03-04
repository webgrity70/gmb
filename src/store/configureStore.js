/* eslint-disable no-underscore-dangle */

import { compose, createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import history from '../history';
import redirectMiddleware from '../middlewares/redirect';
import groupChatSocketMiddleware from '../middlewares/groupChatSocket';
import challengeChatSocketMiddleware from '../middlewares/challengeChatSocket';
import chatSocketMiddleware from '../middlewares/chatSocket';
import authMiddleware from '../middlewares/auth';
import userSocketMiddleware from '../middlewares/userSocket';
import analyticsMiddleware from '../middlewares/analytics';
import toastsMiddleware from '../middlewares/toasts';
import userMiddlware from '../middlewares/user';
import chatMiddleware from '../middlewares/chat';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export default function configureStore() {
  const store = createStore(
    rootReducer(history),
    composeEnhancers(
      applyMiddleware(
        authMiddleware,
        thunk,
        routerMiddleware(history),
        redirectMiddleware,
        analyticsMiddleware,
        toastsMiddleware,
        groupChatSocketMiddleware,
        challengeChatSocketMiddleware,
        chatSocketMiddleware,
        userSocketMiddleware,
        userMiddlware,
        chatMiddleware
      )
    )
  );
  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('../reducers', () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  return store;
}
