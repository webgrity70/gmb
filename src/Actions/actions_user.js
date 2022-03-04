import { createAction } from 'redux-starter-kit';
import { makeFetchAction } from './utils';
import ProfileService from '../Services/ProfileService';
import SubscriptionService from '../Services/SubscriptionService';
import SettingsService from '../Services/SettingsService';
import { authenticatedGet } from '../utils/fetch';
import {
  getGroupsInvitesPaginationNextUrl,
  getChallengesInvitesPaginationNextUrl,
} from '../selectors/profile';

export const fetchUserSubscriptionStarted = createAction(
  '[USER] FETCH_USER_SUBSCRIPTION_STARTED'
);
export const fetchUserSubscriptionSucceeded = createAction(
  '[USER] FETCH_USER_SUBSCRIPTION_SUCCEEDED'
);
export const fetchUserSubscriptionFailed = createAction(
  '[USER] FETCH_USER_SUBSCRIPTION_FAILED'
);

export function fetchUserSubscription(userId, { update = false } = {}) {
  return async (dispatch) => {
    dispatch(fetchUserSubscriptionStarted());
    try {
      let data;
      if (update) {
        data = await SubscriptionService.getAndUpdateUserSubscription(userId);
      } else {
        data = await SubscriptionService.getUserSubscription(userId);
      }
      dispatch(fetchUserSubscriptionSucceeded(data));
      return data;
    } catch (e) {
      dispatch(fetchUserSubscriptionFailed(e));
    }
  };
}

export const fetchUserData = makeFetchAction({
  actionGroup: 'USER',
  action: 'FETCH_USER_DATA',
  fetchData: ProfileService.getProfile,
});

export const fetchUserNotifications = makeFetchAction({
  actionGroup: 'USER',
  action: 'FETCH_USER_NOTIFICATIONS',
  fetchData: SettingsService.getNotificationSettings,
});

export const saveUserAvatar = makeFetchAction({
  actionGroup: 'USER',
  action: 'SAVE_USER_AVATAR',
  fetchData: ProfileService.saveUserAvatar,
});

export const changePassword = makeFetchAction({
  actionGroup: 'USER',
  action: 'CHANGE_PASSWORD',
  fetchData: SettingsService.passwordChange,
});

export const putOnHoldAcc = makeFetchAction({
  actionGroup: 'USER',
  action: 'PUT_ON_HOLD',
  fetchData: SettingsService.putOnHold,
});

export const removeAccount = makeFetchAction({
  actionGroup: 'USER',
  action: 'REMOVE_ACCOUNT',
  fetchData: SettingsService.removeAccount,
});

export const updatePrivacySettings = makeFetchAction({
  actionGroup: 'USER',
  action: 'UPDATE_PRIVACY',
  fetchData: SettingsService.updatePrivacySettings,
});

export const getPrivacySettings = makeFetchAction({
  actionGroup: 'USER',
  action: 'GET_PRIVACY',
  fetchData: SettingsService.getPrivacySettings,
});

export const saveUserSettings = makeFetchAction({
  actionGroup: 'USER',
  action: 'SAVE_USER_NOTIFICATIONS',
  fetchData: SettingsService.saveSettings,
  onSucceedPayload: (args, data) => ({
    ...args[0],
    userId: args[1],
    skipToast: args[2],
    ...data,
  }),
});

export const getNotificationSettings = makeFetchAction({
  actionGroup: 'USER',
  action: 'GET_USER_NOTIFICATIONS',
  fetchData: SettingsService.getNotificationSettings,
});

export const updateUserNotifications = makeFetchAction({
  actionGroup: 'USER',
  action: 'UPDATE_USER_NOTIFICATIONS',
  fetchData: SettingsService.updateNotifications,
  onSucceedPayload: (args, data) => ({
    ...args[0],
    skipToast: args[1],
    ...data,
  }),
});

export const logout = createAction('[USER] LOGOUT');

export const connectSocket = createAction('[USER] CONNECT_SOCKET');
export const connectSocketSucceeded = createAction(
  '[USER] CONNECT_SOCKET_SUCCEEDED'
);
export const connectSocketFailed = createAction('[USER] CONNECT_SOCKET_FAILED');

export const fetchGroupsInvitesStarted = createAction(
  '[USER] FETCH_GROUPS_INVITES'
);
export const fetchGroupsInvitesSucceeded = createAction(
  '[USER] FETCH_GROUPS_INVITES_SUCCEEDED'
);
export const fetchGroupsInvitesFailed = createAction(
  '[USER] FETCH_GROUPS_INVITES_FAILED'
);

export const fetchChallengesInvitesStarted = createAction(
  '[USER] FETCH_CHALLENGES_INVITES'
);
export const fetchChallengesInvitesSucceeded = createAction(
  '[USER] FETCH_CHALLENGES_INVITES_SUCCEEDED'
);
export const fetchChallengesInvitesFailed = createAction(
  '[USER] FETCH_CHALLENGES_INVITES_FAILED'
);

export const disconnectSocket = createAction('[USER] DISCONNECT_SOCKET');
export const disconnectSocketSucceeded = createAction(
  '[USER] DISCONNECT_SOCKET_SUCCEEDED'
);
export const disconnectSocketFailed = createAction(
  '[USER] DISCONNECT_SOCKET_FAILED'
);

export function fetchGroupsInvites({ usePagination }) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchGroupsInvitesStarted());
    const nextUrl = getGroupsInvitesPaginationNextUrl(state);
    try {
      let data;
      if (nextUrl && usePagination) {
        data = await authenticatedGet(nextUrl);
      } else {
        data = await ProfileService.getGroupsInvites();
      }
      dispatch(fetchGroupsInvitesSucceeded({ usePagination, ...data }));
    } catch (e) {
      dispatch(fetchGroupsInvitesFailed(e));
    }
  };
}

export function fetchChallengesInvites({ usePagination }) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchChallengesInvitesStarted());
    const nextUrl = getChallengesInvitesPaginationNextUrl(state);
    try {
      let data;
      if (nextUrl && usePagination) {
        data = await authenticatedGet(nextUrl);
      } else {
        data = await ProfileService.getChallengesInvites();
      }
      dispatch(fetchChallengesInvitesSucceeded({ usePagination, ...data }));
    } catch (e) {
      dispatch(fetchChallengesInvitesFailed(e));
    }
  };
}

export const fetchRecentBehaviorsAction = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'FETCH_USER_RECENT_BEHAVIORS',
  fetchData: ProfileService.getRecentHabits,
  onSucceedPayload: (args, data) => ({ userId: args[0], data }),
});

export const fetchRecentEventTemplatesAction = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'FETCH_USER_RECENT_EVENT_TEMPLATES',
  fetchData: ProfileService.getRecentEventTemplates,
  onSucceedPayload: (args, data) => ({ userId: args[0], data }),
});
