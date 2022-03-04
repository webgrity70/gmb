import createHandlerMiddleware from 'redux-handler-middleware';
import { push } from 'connected-react-router';
import get from 'lodash/get';
import * as profileActions from '../Actions/actions_profile';
import * as userActions from '../Actions/actions_user';
import * as groupActions from '../Actions/actions_groups';
import * as challengeActions from '../Actions/actions_challenges';

import {
  getUserHasPlan,
  isPlanCancelled,
  getUserSubscription,
} from '../reducers/session/selectors';
import * as planActions from '../Actions/actions_plan';
import { getPathname } from '../selectors/router';
import {
  getMyProfileId /* , getProfilePercentage */,
  isLocationCompleted,
} from '../selectors/profile';
import { BUDDIES_FILTER_STATE } from '../constants';
import hasExpired from '../utils/hasExpired';
import history from '../history';

const LOGIN = '/login';
const HOME = '/';
const DASHBOARD = '/dashboard';
const SUBSCRIPTION = '/settings/subscriptions';
const SETTINGS = '/settings';
const NOTIFICATIONS = '/settings/notifications';
const PRIVACY = '/settings/privacy';
const SECURITY = '/settings/security';
const PRICING = '/pricing';
const CHALLENGES = '/challenges';
const EDIT_CHALLENGE = '/edit-challenge';
const BETA = '/beta';
const VERIFY = '/verify';
const avoidPaths = [
  BETA,
  VERIFY,
  SETTINGS,
  NOTIFICATIONS,
  SECURITY,
  PRIVACY,
  LOGIN,
  HOME,
  SUBSCRIPTION,
  PRICING,
];

function checkHandleInvitation(store) {
  const invitation = (() => {
    const {
      location: { search },
    } = window;
    if (!search.includes('invitation')) return null;
    const key = new URLSearchParams(search).get('invitation');
    return { key, id: key.split('-')[0] };
  })();
  if (invitation) {
    store.dispatch(
      challengeActions.acceptInvitation(invitation.id, invitation.key)
    );
  }
}
function subscriptionHandler(store) {
  const state = store.getState();
  const myId = getMyProfileId(state);
  const subscription = getUserSubscription(state);
  const expired = hasExpired(subscription);
  const cancelled = isPlanCancelled(state);
  const hasPlan = getUserHasPlan(state);
  if (expired || !hasPlan || cancelled) {
    const pathname = getPathname(state);
    const paths = [...avoidPaths, `/profile/${myId}`];
    if (myId && !paths.includes(pathname))
      store.dispatch(push('/settings/subscriptions'));
  }
}
function isNewHandler(store) {
  const state = store.getState();
  const myProfileId = getMyProfileId(state);
  const myProfilePath = `/profile/${myProfileId}`;
  if (myProfileId) {
    store.dispatch(push(myProfilePath));
    localStorage.removeItem('new-register');
  }
}
function profileProgressHandler(store) {
  const state = store.getState();
  const myProfileId = getMyProfileId(state);
  const pathname = getPathname(state);
  const myProfilePath = `/profile/${myProfileId}`;
  if (myProfileId) {
    const completed = isLocationCompleted(state, { profileId: myProfileId });
    if (!completed && ![...avoidPaths, myProfilePath].includes(pathname)) {
      store.dispatch(push(myProfilePath));
      return true;
    }
    return false;
  }
  return false;
}
export default createHandlerMiddleware([
  {
    actions: [
      planActions.deleteEvent.succeeded.type,
      planActions.updateEvent.succeeded.type,
      planActions.updatePlan.succeeded.type,
      planActions.deletePlan.succeeded.type,
      planActions.createPlan.succeeded.type,
      planActions.createEvent.succeeded.type,
      planActions.fetchEventDetails.failed.type,
      planActions.fetchPlan.failed.type,
    ],
    afterHandler: (store, { payload }) => {
      history.block(() => null);
      const state = store.getState();
      const pathname = getPathname(state);
      const blockedPaths = [DASHBOARD, CHALLENGES, EDIT_CHALLENGE];
      const skipProp = !payload.skipToast && !payload.skipAction;
      const path = `/${pathname.split('/')[1]}`;
      if (!blockedPaths.includes(path) && skipProp)
        store.dispatch(push('/plan'));
    },
  },
  {
    action: groupActions.deleteGroup.succeeded.type,
    afterHandler: (store) => {
      store.dispatch(push('/groups'));
    },
  },
  {
    action: challengeActions.createChallenge.succeeded.type,
    afterHandler: (store, { payload }) => {
      history.block(() => null);
      const id = get(payload, 'details.challenge.id', null);
      if (id) store.dispatch(push(`/challenges/${id}`));
      else store.dispatch(push('/challenges'));
    },
  },
  {
    actions: [
      challengeActions.deleteChallenge.succeeded.type,
      challengeActions.fetchChallengeDetails.failed.type,
    ],
    afterHandler: (store, { payload }) => {
      if (!payload.skipToast) store.dispatch(push('/challenges'));
    },
  },
  {
    action: userActions.logout.type,
    afterHandler: (store) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expires');
      sessionStorage.removeItem(BUDDIES_FILTER_STATE);
      store.dispatch(push('/login'));
    },
  },
  {
    action: '@@router/LOCATION_CHANGE',
    afterHandler: (store) => {
      /* const redirected = profileProgressHandler(store);
      if (!redirected) subscriptionHandler(store); */
      subscriptionHandler(store);
    },
  },
  {
    action: profileActions.fetchUserInformation.succeeded.type,
    afterHandler: (store) => {
      const state = store.getState();
      const pathname = getPathname(state);
      const blockedPaths = [LOGIN, HOME];
      const isNew = localStorage.getItem('new-register');
      if (isNew) isNewHandler(store);
      else if (!blockedPaths.includes(pathname)) {
        profileProgressHandler(store);
      }
    },
  },
  {
    action: userActions.fetchUserSubscriptionSucceeded.type,
    afterHandler: subscriptionHandler,
  },
  {
    action: challengeActions.createPlanJoinRegularChallenge.succeeded.type,
    beforeHandler: (store, { payload }) => {
      checkHandleInvitation(store);
      store.dispatch(push(`/challenges/${payload.challengeId}`));
    },
  },
  {
    action: challengeActions.createPlanJoinFlashChallenge.succeeded.type,
    beforeHandler: (store) => {
      checkHandleInvitation(store);
    },
  },
]);
