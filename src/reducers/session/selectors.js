import { createSelector } from 'redux-starter-kit';
import moment from 'moment';

export const getUserData = (state) => state.session.user;
export const getUserNotifications = (state) => state.session.notifications;

export const getUserSubscription = (state) => state.session.userSubscription;
const getRequests = (state) => state.requests;

export const getCurrentUserId = createSelector([getUserData], (user) =>
  user.pk ? user.pk.toString() : undefined
);

export const getUserPlanName = createSelector(
  [getUserSubscription],
  (subscription) => subscription.planName
);

export const getUserHasPlan = createSelector(
  [getUserSubscription],
  (subscription) => Boolean(subscription.planName)
);

export const isPlanCancelled = createSelector(
  [getUserSubscription],
  ({ planStatus }) => (planStatus ? planStatus === 'cancelled' : false)
);

export const getIsPlanInTrial = createSelector(
  [getUserSubscription],
  (subscription) => subscription.planStatus === 'in_trial'
);

export const getUserHasCard = createSelector(
  [getUserSubscription],
  ({ cardStatus }) => cardStatus && cardStatus !== 'no_card'
);

export const getUserHasNoCard = createSelector(
  [getUserSubscription],
  ({ cardStatus }) => (!cardStatus ? false : cardStatus === 'no_card')
);

export const getDaysLeftOfPlanTrial = createSelector(
  [getUserSubscription, getIsPlanInTrial],
  (subscription, isPlanInTrial) => {
    if (!isPlanInTrial || !subscription.trialEnd) {
      return 0;
    }
    const daysDiff = moment(subscription.trialEnd).diff(moment(), 'days', true);
    return Math.ceil(daysDiff);
  }
);

export const getRegisterLoading = createSelector(
  [getRequests],
  ({ register }) => register.loading
);

export const getDraftPlan = (state) => state.session.draftPlan;
