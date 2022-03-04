import { combineReducers } from 'redux';
import groupMembers from './groupMembers';
import groupAnnouncements from './groupAnnouncements';
import groupPendingPrivateMembers from './groupPendingPrivateMembers';
import groupsInvites from './groupsInvites';
import groups from './groups';
import groupsChat from './groupsChat';
import myGroups from './myGroups';
import joinableGroups from './joinableGroups';
import globalTemplates from './globalTemplates';
import flashChallenges from './flashChallenges';
import challengesInvites from './challengesInvites';
import challengesForInvites from './challengesForInvites';
import challengesChat from './challengesChat';
import challengeMembers from './challengeMembers';
import challenges from './challenges';
import groupPosts from './groupPosts';
import groupPostResponses from './groupPostResponses';

const paginationReducer = combineReducers({
  groupMembers,
  groupAnnouncements,
  groupPosts,
  groupPostResponses,
  groupPendingPrivateMembers,
  flashChallenges,
  challengesForInvites,
  groups,
  groupsChat,
  groupsInvites,
  myGroups,
  challenges,
  challengesChat,
  challengesInvites,
  challengeMembers,
  joinableGroups,
  globalTemplates,
});

export default paginationReducer;
