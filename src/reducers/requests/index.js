import { combineReducers } from 'redux';
import groups from './groups';
import createAnnouncement from './createAnnouncement';
import ppmStatus from './ppmStatus';
import chatThreads from './chatThreads';
import register from './register';
import createEvent from './createEvent';
import leaveChallenge from './leaveChallenge';
import createPlan from './createPlan';
import chatChallengesThreads from './chatChallengesThreads';
import calendar from './calendar';
import challengeMembers from './challengeMembers';
import multiChallenges from './multiChallenges';
import habits from './habits';
import challengePlan from './challengePlan';
import fetchPosts from './fetchPosts';
import challengeDetails from './challengeDetails';
import chatGroupsThreads from './chatGroupsThreads';
import userGroups from './userGroups';
import joinRegularChallenge from './joinRegularChallenge';
import groupAdmins from './groupAdmins';
import groupTemplates from './groupTemplates';
import groupsInvites from './groupsInvites';
import myGroups from './myGroups';
import joinableGroups from './joinableGroups';
import groupMembers from './groupMembers';
import multiGroups from './multiGroups';
import deletePlan from './deletePlan';
import multiUsers from './multiUsers';
import templateDetails from './templateDetails';
import globalTemplates from './globalTemplates';
import updatePlan from './updatePlan';
import updateEvent from './updateEvent';
import deleteEvent from './deleteEvent';
import deleteGroup from './deleteGroup';
import challengeConfirmations from './challengeConfirmations';
import challengeCheckins from './challengeCheckins';
import flashChallengesList from './flashChallengesList';
import joinFlashChallenge from './joinFlashChallenge';
import createChallenge from './createChallenge';
import deleteChallenge from './deleteChallenge';
import challengesInvites from './challengesInvites';
import challenges from './challenges';
import challengesForInvites from './challengesForInvites';

const requestsReducer = combineReducers({
  groups,
  challenges,
  userGroups,
  createAnnouncement,
  challengeConfirmations,
  createChallenge,
  deleteChallenge,
  chatChallengesThreads,
  challengeCheckins,
  groupsInvites,
  ppmStatus,
  register,
  chatThreads,
  groupAdmins,
  createEvent,
  createPlan,
  challengesInvites,
  calendar,
  challengesForInvites,
  chatGroupsThreads,
  habits,
  myGroups,
  groupMembers,
  updatePlan,
  joinableGroups,
  updateEvent,
  groupTemplates,
  globalTemplates,
  multiUsers,
  multiChallenges,
  multiGroups,
  deletePlan,
  fetchPosts,
  challengeMembers,
  deleteEvent,
  templateDetails,
  flashChallengesList,
  joinFlashChallenge,
  joinRegularChallenge,
  deleteGroup,
  challengeDetails,
  challengePlan,
  leaveChallenge,
});

export default requestsReducer;
