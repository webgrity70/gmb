import { combineReducers } from 'redux';
import userSubscription from './user_subscription';
import user from './user';
import notifications from './notifications';
import groupsInvites from './groupsInvites';
import groups from './groups';
import planWindow from './planWindow';
import draftPlan from './draftPlan';
import auth from './auth';
import challengeCalendarWindow from './challengeCalendarWindow';
import challengesInvites from './challengesInvites';
import challengesForInvites from './challengesForInvites';

const sessionsReducer = combineReducers({
  userSubscription,
  user,
  notifications,
  planWindow,
  groups,
  challengeCalendarWindow,
  challengesForInvites,
  draftPlan,
  auth,
  groupsInvites,
  challengesInvites,
});

export default sessionsReducer;
