import { createAction } from 'redux-starter-kit';
import { makeFetchAction } from './utils';
import ChallengesService from '../Services/ChallengesService';
import { authenticatedPost, authenticatedGet } from '../utils/fetch';
import {
  getMembersPaginationNextUrl,
  getChallengesPaginationNextUrl,
  getChallengesForInvitesPaginationNextUrl,
} from '../selectors/challenges';

export const fetchMembersStarted = createAction('[CHALLENGE] FETCH_MEMBERS');
export const fetchMembersSucceeded = createAction(
  '[CHALLENGE] FETCH_MEMBERS_SUCCEEDED'
);
export const fetchMembersFailed = createAction(
  '[CHALLENGE] FETCH_MEMBERS_FAILED'
);

export const fetchChallengesStarted = createAction(
  '[CHALLENGES] FETCH_CHALLENGES'
);
export const fetchChallengesSucceeded = createAction(
  '[CHALLENGES] FETCH_CHALLENGES_SUCCEEDED'
);
export const fetchChallengesFailed = createAction(
  '[CHALLENGES] FETCH_CHALLENGES_FAILED'
);

export const fetchChallengesForInvitesStarted = createAction(
  '[CHALLENGES] FETCH_FOR_INVITES_CHALLENGES'
);
export const fetchChallengesForInvitesSucceeded = createAction(
  '[CHALLENGES] FETCH_FOR_INVITES_CHALLENGES_SUCCEEDED'
);
export const fetchChallengesForInvitesFailed = createAction(
  '[CHALLENGES] FETCH_FOR_INVITES_CHALLENGES_FAILED'
);

export const fetchFlashChallenges = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'GET_CHALLENGES',
  fetchData: ChallengesService.fetchFlashChallenges,
});

export const fetchChallengeDetails = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'GET_CHALLENGE_DETAIL',
  fetchData: ChallengesService.fetchChallengeDetails,
});

export const fetchChallengeConfirmations = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'GET_CHALLENGE_CONFIRMATIONS',
  fetchData: ChallengesService.fetchChallengeConfirmations,
  onSucceedPayload: (args, data) => ({ challengeId: args[0], data }),
});

export const fetchChallengeCheckins = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'GET_CHALLENGE_CHECK-INS',
  fetchData: ChallengesService.fetchChallengeCheckins,
  onSucceedPayload: (args, data) => ({ challengeId: args[0], data }),
});

export const createPlanJoinFlashChallenge = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'CREATE_PLAN_JOIN_FLASH_CHALLENGE',
  fetchData: ChallengesService.createPlanJoinFlashChallenge,
  onSucceedPayload: (args, data) => ({
    challengeId: args[0].id,
    myUser: args[1],
    skipToast: !!args[2],
    ...data,
  }),
});

export const createPlanJoinRegularChallenge = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'CREATE_PLAN_JOIN_REGULAR_CHALLENGE',
  fetchData: ChallengesService.createPlanJoinRegularChallenge,
  onSucceedPayload: (args, data) => ({
    challengeId: args[0].id,
    myUser: args[1],
    skipToast: !!args[2],
    ...data,
  }),
});

export const createChallenge = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'CREATE_CHALLENGE',
  fetchData: ChallengesService.createChallenge,
  onSucceedPayload: (args, data) => ({ skipToast: args[2], ...data }),
});

export const leaveChallenge = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'LEAVE_CHALLENGE',
  fetchData: ChallengesService.leaveChallenge,
  onSucceedPayload: (args, data) => ({
    challengeId: args[0],
    isOwner: args[1],
    ...data,
  }),
});

export const toggleChallengeNewParticipantSiteNotificationAction = makeFetchAction(
  {
    actionGroup: 'CHALLENGES',
    action: 'TOGGLE_NEW_PARTICIPANT_SITE_NOTIFICATION',
    fetchData: ChallengesService.toggleChallengeNotificationSetting,
    onSucceedPayload: (args) => args[0],
  }
);

export const toggleChallengeNewParticipantEmailNotificationAction = makeFetchAction(
  {
    actionGroup: 'CHALLENGES',
    action: 'TOGGLE_NEW_PARTICIPANT_EMAIL_NOTIFICATION',
    fetchData: ChallengesService.toggleChallengeNotificationSetting,
    onSucceedPayload: (args) => args[0],
  }
);

export const toggleChallengeIntentionSiteNotificationAction = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'TOGGLE_INTENTION_SITE_NOTIFICATION',
  fetchData: ChallengesService.toggleChallengeNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const toggleChallengeIntentionEmailNotificationAction = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'TOGGLE_INTENTION_EMAIL_NOTIFICATION',
  fetchData: ChallengesService.toggleChallengeNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const toggleChallengeCheckinSiteNotificationAction = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'TOGGLE_CHECKIN_SITE_NOTIFICATION',
  fetchData: ChallengesService.toggleChallengeNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const toggleChallengeCheckinEmailNotificationAction = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'TOGGLE_CHECKIN_EMAIL_NOTIFICATION',
  fetchData: ChallengesService.toggleChallengeNotificationSetting,
  onSucceedPayload: (args) => args[0],
});

export const fetchCalendarPlan = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'FETCH_CALENDAR_CHALLENGE',
  fetchData: ChallengesService.fetchCalendarPlan,
  onSucceedPayload: (args, data) => ({ challengeId: args[0], data }),
});

export const renameChallenge = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'RENAME_CHALLENGE',
  fetchData: ChallengesService.renameChallenge,
  onSucceedPayload: (args, data) => ({
    challengeId: args[0],
    name: args[1],
    ...data,
  }),
});

export const changeLanguages = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'CHANE_CHALLENGE_LANGUAGES',
  fetchData: ChallengesService.changeLanguages,
  onSucceedPayload: (args, data) => ({
    challengeId: args[0],
    languages: args[1],
    ...data,
  }),
});

export const changeLocation = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'CHANE_CHALLENGE_LOCATION',
  fetchData: ChallengesService.changeLocation,
  onSucceedPayload: (args, data) => ({
    challengeId: args[0],
    location: args[1],
    ...data,
  }),
});

export const deleteChallenge = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'DELETE_CHALLENGE',
  fetchData: ChallengesService.deleteChallenge,
  onSucceedPayload: (args, data) => ({
    challengeId: args[0],
    skipToast: args[1],
    ...data,
  }),
});

export function fetchMembers(id) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchMembersStarted());
    const nextUrl = getMembersPaginationNextUrl(state);
    try {
      let data;
      if (!nextUrl) {
        data = await ChallengesService.fetchMembers(id);
      } else {
        data = await authenticatedPost(nextUrl);
      }
      dispatch(
        fetchMembersSucceeded({
          challengeId: id,
          data,
        })
      );
    } catch (e) {
      dispatch(fetchMembersFailed(e));
    }
  };
}

export function fetchChallenges() {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchChallengesStarted());
    const nextUrl = getChallengesPaginationNextUrl(state);
    try {
      let data;
      if (!nextUrl) {
        data = await ChallengesService.fetchChallenges();
      } else {
        data = await authenticatedGet(nextUrl);
      }
      dispatch(fetchChallengesSucceeded(data));
    } catch (e) {
      dispatch(fetchChallengesFailed(e));
    }
  };
}

export const changeIntervalDate = createAction(
  '[CHALLENGES] CHANGE_DATE_INTERVAL'
);

export const removeOnGoing = createAction('[CHALLENGES] REMOVE_ONGOING');

export const acceptInvitation = makeFetchAction({
  actionGroup: 'INVITATION',
  action: 'ACCEPT_CHALLENGE_INVITATION',
  fetchData: ChallengesService.acceptInvitation,
  onSucceedPayload: (args, data) => ({ key: args[1], ...data }),
});

export const rejectInvitation = makeFetchAction({
  actionGroup: 'INVITATION',
  action: 'REJECT_CHALLENGE_INVITATION',
  fetchData: ChallengesService.rejectInvitation,
  onSucceedPayload: (args, data) => ({ key: args[1], ...data }),
});

export const fetchCalendarWindow = makeFetchAction({
  actionGroup: 'CHALLENGE',
  action: 'FETCH_CALENDAR_WINDOw',
  fetchData: ChallengesService.getCalendarWindow,
});

export function fetchChallengesForInvites() {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchChallengesForInvitesStarted());
    const nextUrl = getChallengesForInvitesPaginationNextUrl(state);
    try {
      let data;
      if (!nextUrl) {
        data = await ChallengesService.fetchChallengesForInvites();
      } else {
        data = await authenticatedGet(nextUrl);
      }
      dispatch(fetchChallengesForInvitesSucceeded(data));
    } catch (e) {
      dispatch(fetchChallengesForInvitesFailed(e));
    }
  };
}

export const inviteToChallenge = makeFetchAction({
  actionGroup: 'CHALLENGE',
  action: 'INVITE_TO_CHALLENGE',
  fetchData: ChallengesService.inviteToChallenge,
});
