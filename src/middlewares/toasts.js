import createHandlerMiddleware from 'redux-handler-middleware';
import isEmpty from 'lodash/isEmpty';
import startCase from 'lodash/startCase';
import { toast } from 'react-toastify';
import * as planActions from '../Actions/actions_plan';
import * as userActions from '../Actions/actions_user';
import * as profileActions from '../Actions/actions_profile';
import * as groupActions from '../Actions/actions_groups';
import * as chatActions from '../Actions/action_chat';
import * as challengeActions from '../Actions/actions_challenges';
import * as challengeChatActions from '../Actions/actions_challenges_chat';
import * as buddyRequestActions from '../Actions/action_buddy_request';

export default createHandlerMiddleware([
  {
    actions: [
      planActions.updateEvent.succeeded.type,
      planActions.deleteEvent.succeeded.type,
      planActions.deletePlan.succeeded.type,
      planActions.updatePlan.succeeded.type,
      profileActions.cancelBuddyRequest.succeeded.type,
      userActions.saveUserSettings.succeeded.type,
      userActions.updateUserNotifications.succeeded.type,
      groupActions.inviteUserToGroup.succeeded.type,
      groupActions.deleteGroup.succeeded.type,
      challengeActions.createPlanJoinFlashChallenge.succeeded.type,
      challengeActions.createPlanJoinRegularChallenge.succeeded.type,
      planActions.createEvent.succeeded.type,
      planActions.createPlan.succeeded.type,
      challengeActions.createChallenge.succeeded.type,
      challengeActions.acceptInvitation.succeeded.type,
      challengeActions.deleteChallenge.succeeded.type,
      challengeActions.leaveChallenge.succeeded.type,
    ],
    afterHandler: (_, { payload }) => {
      if (!payload.skipToast) toast.success(payload.message || 'Success');
    },
  },
  {
    action: planActions.fetchEventDetails.failed.type,
    afterHandler: (_, { payload }) =>
      toast.error(`Event error: ${payload.detail}`),
  },
  {
    actions: [
      planActions.updateEvent.failed.type,
      planActions.updatePlan.failed.type,
      planActions.deleteEvent.failed.type,
      planActions.deletePlan.failed.type,
      planActions.fetchPlan.failed.type,
      userActions.updateUserNotifications.failed.type,
      userActions.saveUserSettings.failed.type,
      planActions.createEvent.failed.type,
      planActions.createPlan.failed.type,
      buddyRequestActions.acceptRequest.failed.type,
      groupActions.inviteUserToGroup.failed.type,
      groupActions.acceptInvitation.failed.type,
      groupActions.createGroup.failed.type,
      groupActions.rejectInvitation.failed.type,
      groupActions.contactAdmin.failed.type,
      challengeActions.deleteChallenge.failed.type,
      groupActions.contactMemberFailed.type,
      groupActions.deleteGroup.failed.type,
      chatActions.leaveChat.failed.type,
      challengeActions.createPlanJoinFlashChallenge.failed.type,
      challengeActions.createPlanJoinRegularChallenge.failed.type,
      challengeActions.leaveChallenge.failed.type,
      challengeActions.createChallenge.failed.type,
      challengeActions.renameChallenge.failed.type,
      challengeActions.changeLanguages.failed.type,
      challengeActions.changeLocation.failed.type,
      challengeChatActions.contactOwner.failed.type,
      profileActions.cancelBuddyRequest.failed.type,
      profileActions.sendBuddyRequest.failed.type,
      profileActions.sendBetaInvite.failed.type,
    ],
    afterHandler: (_, { payload }) => {
      if (!payload.skipToast) {
        if (!isEmpty(payload.details)) {
          const details = Object.keys(payload.details).map(
            (e) => `${startCase(e)}: ${payload.details[e]}`
          );
          const error = details.join(' ');
          toast.error(error);
        } else {
          toast.error(payload.message || payload.detail);
        }
      }
    },
  },

  {
    actions: [
      profileActions.sendBuddyRequest.succeeded.type,
      profileActions.sendBetaInvite.succeeded.type,
    ],
    afterHandler: (store, { payload }) => {
      toast.success(payload.data.message);
    },
  },
]);
