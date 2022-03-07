import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import { ConnectedRouter } from 'connected-react-router';
import { SENTRY_DSN } from './settings';
import 'rc-slider/assets/index.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-toastify/dist/ReactToastify.css';
import 'get_motivated_buddies_semantictheme/dist/semantic.min.css';
import 'slick-carousel/slick/slick.css';
import 'rc-tooltip/assets/bootstrap_white.css';
import 'react-dates/lib/css/_datepicker.css';
import 'react-phone-input-2/dist/style.css';
import 'react-input-range/lib/css/index.css';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';
import './styles/global.scss';
import './styles/main.scss';

import App from './App';
import ScrollToTop from './Components/Elements/ScrollToTop';
import configureStore from './store/configureStore';
import history from './history';
import register from './registerServiceWorker'

const store = configureStore();

if (
  process.env.NODE_ENV === 'production' &&
  process.env.REACT_APP_SENTRY_RELEASE
) {
  Sentry.init({
    dsn: SENTRY_DSN,
    release: process.env.REACT_APP_SENTRY_RELEASE,
  });
}

if (history.location && history.location.state && history.location.state.from) {
  const state = { ...history.location.state };

  delete state.from;

  history.replace({ ...history.location, state });
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
register();