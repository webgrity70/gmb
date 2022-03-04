import axios from 'axios';

import { isDev, isLocalDev, isLocalhost } from './registerServiceWorker';

const ACCESS_TOKEN = 'access_token';

function getApiURL() {
  if (isLocalDev) {
    return 'http://127.0.0.1:8000/';
  }

  if (isDev || isLocalhost) {
    return 'https://dev.getmotivatedbuddies.com/';
  }

  return 'https://backend.getmotivatedbuddies.com/';
}

function getWebSocketURL() {
  if (isLocalDev) {
    return 'ws://127.0.0.1:8000/';
  }

  if (isDev || isLocalhost) {
    return 'wss://dev.getmotivatedbuddies.com/';
  }

  return 'wss://backend.getmotivatedbuddies.com/';
}

const baseURL = getApiURL();

function getIntercomKey() {
  if (isDev || isLocalhost) {
    return 'odzopu5t';
  }
  return 'e08h9yvh';
}

function getChargebeeSiteKey() {
  if (isDev || isLocalhost) {
    return 'getmotivatedbuddies-test';
  }
  return 'getmotivatedbuddies';
}

function getSentryDsn() {
  if (isDev || isLocalhost) {
    return 'https://eabc499fc9aa4815aef64c484da8b14b@sentry.io/1383315';
  }

  return 'https://d7cf7669e9a0405fa4092bf8dd300f7e@sentry.io/1383317';
}

// noinspection SpellCheckingInspection
export const CLIENT_ID = '1h9L7uVLtna8zmdbIID71rOetM1ojG0RD2zcj0aY';
// noinspection SpellCheckingInspection
export const CLIENT_SECRET =
  'lQbcoz3GaXZ0EhevSwsx6k3NDvDZz9c2etsRR2GtqHgLbRV1VgmrheZdIHuoXQCgihDn73KqOE4FB7e8JamNjGGNF9yBNjXOFx4uZdq2lTT9ClSyX8vNaZvRNE1nEmpN';
export const BASE_URI = baseURL;
export const API_URI = `${baseURL}api/`;
export const WEBSOCKET_URI = `${getWebSocketURL()}ws/`;
export const INTERCOM_API_KEY = getIntercomKey();
export const CHARGEBEE_SITE_KEY = getChargebeeSiteKey();
export const SENTRY_DSN = getSentryDsn();
export const getAppToken = () => localStorage.getItem(ACCESS_TOKEN);

export const createRequest = (endpoint, method, data) =>
  axios(`${API_URI}${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${getAppToken()}` },
    data,
  });
