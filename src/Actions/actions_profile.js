import { createAction } from 'redux-starter-kit';
import { makeFetchAction } from './utils';
import { authenticatedGet } from '../utils/fetch';
import ProfileService from '../Services/ProfileService';
import BuddiesService from '../Services/BuddiesService';
import { getCurrentUserId } from '../reducers/session/selectors';
import { getMyGroupsPaginationNextUrl } from '../selectors/profile';

export const fetchLanguagesStarted = createAction('[PROFILE] FETCH_LANGUAGES');
export const fetchLanguagesSucceeded = createAction(
  '[PROFILE] FETCH_LANGUAGES_SUCCEEDED'
);
export const fetchLanguagesFailed = createAction(
  '[PROFILE] FETCH_LANGUAGES_FAILED'
);
export const fetchAppsSucceeded = createAction('[USER] FETCH_APPS_SUCCCESS');

export const fetchUserGroupsStarted = createAction(
  '[PROFILE] FETCH_USER_GROUPS'
);
export const fetchUserGroupsSucceeded = createAction(
  '[PROFILE] FETCH_USER_GROUPS_SUCCEEDED'
);
export const fetchUserGroupsFailed = createAction(
  '[PROFILE] FETCH_USER_GROUPS_FAILED'
);

export const fetchMyGroupsStarted = createAction('[PROFILE] FETCH_MY_GROUPS');
export const fetchMyGroupsSucceeded = createAction(
  '[PROFILE] FETCH_MY_GROUPS_SUCCEEDED'
);
export const fetchMyGroupsFailed = createAction(
  '[PROFILE] FETCH_MY_GROUPS_FAILED'
);

export const fetchApps = () => async (dispatch) => {
  try {
    const data = await ProfileService.fetchApps();
    dispatch(fetchAppsSucceeded(data));
  } catch (e) {
    console.log(e); // TO DO;
  }
};

export function fetchLanguages() {
  return async (dispatch) => {
    dispatch(fetchLanguagesStarted());
    try {
      const data = await ProfileService.getLanguages();
      dispatch(fetchLanguagesSucceeded(data));
    } catch (e) {
      dispatch(fetchLanguagesFailed(e));
    }
  };
}

export const updateLanguagesStarted = createAction(
  '[PROFILE] UPDATE_LANGUAGES_STARTED'
);
export const updateLanguagesSucceeded = createAction(
  '[PROFILE] UPDATE_LANGUAGES_SUCCEEDED'
);
export const updateLanguagesFailed = createAction(
  '[PROFILE] UPDATE_LANGUAGES_FAILED'
);

export function updateLanguages(languages) {
  return async (dispatch, getState) => {
    const userId = getCurrentUserId(getState());
    dispatch(updateLanguagesStarted());
    let action;
    try {
      await ProfileService.updateUserLanguages(languages);
      action = updateLanguagesSucceeded({ userId, languages });
    } catch (e) {
      action = updateLanguagesFailed(e);
    }
    dispatch(action);
    return action;
  };
}

const defaultUserOnSucceedPayload = (args, data) => ({
  userId: args[0],
  data,
});

const defaultUserOnErrorPayload = (args, error) => ({
  userId: args[0],
  error,
});

const handleUpdateEntityUserSuccess = (privacyKey, resultsKey) => (args) => ({
  userId: args[1],
  body: {
    results: args[0][resultsKey],
    [privacyKey]: args[0].privacy,
  },
});

const handleUpdateUserGroups = (args) => ({
  userId: args[2],
  body: {
    results: args[1],
    groupsPrivacy: args[0].privacy,
  },
});

export const fetchUserInformation = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'FETCH_USER_INFORMATION',
  fetchData: ProfileService.getUserInformation,
  onSucceedPayload: defaultUserOnSucceedPayload,
  onErrorPayload: defaultUserOnErrorPayload,
});

export const fetchUserProfile = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'FETCH_USER_PROFILE',
  fetchData: ProfileService.getUserProfile,
  onSucceedPayload: defaultUserOnSucceedPayload,
  onErrorPayload: defaultUserOnErrorPayload,
});

export const fetchUserAbout = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'FETCH_USER_ABOUT',
  fetchData: ProfileService.getUserAbout,
  onSucceedPayload: defaultUserOnSucceedPayload,
  onErrorPayload: defaultUserOnErrorPayload,
});

export const fetchUserApps = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'FETCH_USER_APPS',
  fetchData: ProfileService.getUserApps,
  onSucceedPayload: defaultUserOnSucceedPayload,
  onErrorPayload: defaultUserOnErrorPayload,
});

export const fetchUserBehaviours = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'FETCH_USER_BEHAVIOURS',
  fetchData: ProfileService.getUserBehaviours,
  onSucceedPayload: defaultUserOnSucceedPayload,
  onErrorPayload: defaultUserOnErrorPayload,
});

export const fetchUserPreferences = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'FETCH_USER_PREFERENCES',
  fetchData: ProfileService.getUserPreferences,
  onSucceedPayload: defaultUserOnSucceedPayload,
  onErrorPayload: defaultUserOnErrorPayload,
});

export const fetchUserPsychology = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'FETCH_USER_PSYCHOLOGY',
  fetchData: ProfileService.getUserPsychology,
  onSucceedPayload: defaultUserOnSucceedPayload,
  onErrorPayload: defaultUserOnErrorPayload,
});

export const fetchUserScore = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'FETCH_USER_SCORE',
  fetchData: ProfileService.getUserScore,
  onSucceedPayload: defaultUserOnSucceedPayload,
  onErrorPayload: defaultUserOnErrorPayload,
});

export const fetchUserCategories = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'FETCH_USER_CATEGORIES',
  fetchData: ProfileService.getUserCategories,
  onSucceedPayload: defaultUserOnSucceedPayload,
  onErrorPayload: defaultUserOnErrorPayload,
});

export const updateUserPsychology = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'UPDATE_USER_PSYCHOLOGY',
  fetchData: ProfileService.updateUserPsychology,
  onSucceedPayload: handleUpdateEntityUserSuccess(
    'psychologyPrivacy',
    'psychology'
  ),
});

export const updateUserGroups = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'UPDATE_USER_GROUPS',
  fetchData: ProfileService.updateUserGroups,
  onSucceedPayload: handleUpdateUserGroups,
});

export const fetchPsychology = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'FETCH_PSYCHOLOGY',
  fetchData: ProfileService.fetchPsychology,
  onSucceedPayload: (args, data) => data,
});

export const updateUserApps = makeFetchAction({
  actionGroup: 'PROFILE',
  action: 'UPDATE_USER_APPS',
  fetchData: ProfileService.updateUserApps,
  onSucceedPayload: handleUpdateEntityUserSuccess('appsPrivacy', 'apps'),
});

export const sendBuddyRequest = makeFetchAction({
  actionGroup: 'BUDDIES',
  action: 'SEND_BUDDY_REQUEST',
  fetchData: BuddiesService.sendBuddyRequest,
});

export const cancelBuddyRequest = makeFetchAction({
  actionGroup: 'BUDDIES',
  action: 'CANCEL_BUDDY_REQUEST',
  fetchData: BuddiesService.cancelBuddyRequest,
});

export const sendBetaInvite = makeFetchAction({
  actionGroup: 'BUDDIES',
  action: 'SEND_BETA_INVITE',
  fetchData: BuddiesService.sendBetaInvite,
});

export const updateLocationStarted = createAction(
  '[PROFILE] UPDATE_LOCATION_STARTED'
);
export const updateLocationSucceeded = createAction(
  '[PROFILE] UPDATE_LOCATION_SUCCEEDED'
);
export const updateLocationFailed = createAction(
  '[PROFILE] UPDATE_LOCATION_FAILED'
);

export function updateLocation(location) {
  return async (dispatch, getState) => {
    const userId = getCurrentUserId(getState());
    dispatch(updateLanguagesStarted());
    let action;
    try {
      await ProfileService.updateUserLocation(location);
      action = updateLocationSucceeded();
      dispatch(fetchUserInformation(userId));
    } catch (e) {
      action = updateLocationFailed(e);
    }
    dispatch(action);
    return action;
  };
}

export const updateAboutStarted = createAction(
  '[PROFILE] UPDATE_ABOUT_STARTED'
);
export const updateAboutSucceeded = createAction(
  '[PROFILE] UPDATE_ABOUT_SUCCEEDED'
);
export const updateAboutFailed = createAction('[PROFILE] UPDATE_ABOUT_FAILED');

export function updateAbout(about) {
  return async (dispatch, getState) => {
    const userId = getCurrentUserId(getState());
    dispatch(updateAboutStarted());
    let action;
    try {
      await ProfileService.updateUserAbout(about);
      action = updateAboutSucceeded({ userId, about });
    } catch (e) {
      action = updateAboutFailed(e);
    }
    dispatch(action);
    return action;
  };
}

export const updateOccupationStarted = createAction(
  '[PROFILE] UPDATE_OCCUPATION_STARTED'
);
export const updateOccupationSucceeded = createAction(
  '[PROFILE] UPDATE_OCCUPATION_SUCCEEDED'
);
export const updateOccupationFailed = createAction(
  '[PROFILE] UPDATE_OCCUPATION_FAILED'
);

export function updateOccupation(occupation) {
  return async (dispatch, getState) => {
    const userId = getCurrentUserId(getState());
    dispatch(updateOccupationStarted());
    let action;
    try {
      await ProfileService.updateUserOccupation(occupation);
      action = updateOccupationSucceeded({ userId, occupation });
    } catch (e) {
      action = updateOccupationFailed(e);
    }
    dispatch(action);
    return action;
  };
}

export const updateNegativeBehavioursStarted = createAction(
  '[PROFILE] UPDATE_USER_BEHAVIOURS_STARTED'
);
export const updateNegativeBehavioursSucceeded = createAction(
  '[PROFILE] UPDATE_USER_BEHAVIOURS_SUCCEEDED'
);
export const updateNegativeBehavioursFailed = createAction(
  '[PROFILE] UPDATE_USER_BEHAVIOURS_FAILED'
);

export function updateNegativeBehaviours(behaviours) {
  return async (dispatch, getState) => {
    const userId = getCurrentUserId(getState());
    dispatch(updateNegativeBehavioursStarted());
    let action;
    try {
      await ProfileService.updateUserBehaviours(behaviours);
      action = updateNegativeBehavioursSucceeded();
      dispatch(fetchUserBehaviours(userId));
    } catch (e) {
      action = updateNegativeBehavioursFailed(e);
    }
    dispatch(action);
    return action;
  };
}

export const updateBuddyPreferencesStarted = createAction(
  '[PROFILE] UPDATE_USER_BUDDY_PREFERENCES_STARTED'
);
export const updateBuddyPreferencesSucceeded = createAction(
  '[PROFILE] UPDATE_USER_BUDDY_PREFERENCES_SUCCEEDED'
);
export const updateBuddyPreferencesFailed = createAction(
  '[PROFILE] UPDATE_USER_BUDDY_PREFERENCES_FAILED'
);

export function updateBuddyPreferences(preferences) {
  return async (dispatch, getState) => {
    const userId = getCurrentUserId(getState());
    dispatch(updateBuddyPreferencesStarted());
    let action;
    try {
      await ProfileService.updateUserPreferences(preferences);
      action = updateBuddyPreferencesSucceeded();
      dispatch(fetchUserPreferences(userId));
    } catch (e) {
      action = updateBuddyPreferencesFailed(e);
    }
    dispatch(action);
    return action;
  };
}

export function fetchUserGroups({ userId }) {
  return async (dispatch) => {
    dispatch(fetchUserGroupsStarted());
    try {
      const data = await ProfileService.getUserGroups(userId);
      dispatch(fetchUserGroupsSucceeded({ userId, data }));
    } catch (error) {
      dispatch(fetchUserGroupsFailed({ userId, error }));
    }
  };
}

export function fetchMyGroups({ usePagination, pageSize }) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchMyGroupsStarted());
    const nextUrl = getMyGroupsPaginationNextUrl(state);
    try {
      let data;
      if (nextUrl && usePagination) {
        data = await authenticatedGet(nextUrl);
      } else {
        data = await ProfileService.getMyGroups({ pageSize });
      }
      dispatch(fetchMyGroupsSucceeded({ data, usePagination }));
    } catch (error) {
      dispatch(fetchMyGroupsFailed({ error }));
    }
  };
}
