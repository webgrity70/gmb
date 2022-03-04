import { createSelector } from 'redux-starter-kit';

const getIdFromProps = (state, props) => props.id;

const getRequests = (state) => state.requests;

export const createEventRequest = createSelector(
  [getRequests],
  ({ createEvent }) => createEvent
);

export const createPlanRequest = createSelector(
  [getRequests],
  ({ createPlan }) => createPlan
);

export const getCreateEventLoading = createSelector(
  [createEventRequest],
  ({ loading }) => loading
);

export const getCreatePlanLoading = createSelector(
  [createPlanRequest],
  ({ loading }) => loading
);

export const updatePlanRequest = createSelector(
  [getRequests],
  ({ updatePlan }) => updatePlan
);

export const getUpdatePlanLoading = createSelector(
  [updatePlanRequest],
  ({ loading }) => loading
);

export const updateEventRequest = createSelector(
  [getRequests],
  ({ updateEvent }) => updateEvent
);

export const getUpdateEventLoading = createSelector(
  [updateEventRequest],
  ({ loading }) => loading
);

export const deleteEventRequest = createSelector(
  [getRequests],
  ({ deleteEvent }) => deleteEvent
);

export const getDeleteEventLoading = createSelector(
  [deleteEventRequest],
  ({ loading }) => loading
);

export const deleteGroupRequest = createSelector(
  [getRequests],
  ({ deleteGroup }) => deleteGroup
);

export const getDeleteGroupLoading = createSelector(
  [deleteGroupRequest],
  ({ loading }) => loading
);

export const deletePlanRequest = createSelector(
  [getRequests],
  ({ deletePlan }) => deletePlan
);

export const getDeletePlanLoading = createSelector(
  [deletePlanRequest],
  ({ loading }) => loading
);

const getHabitsRequest = createSelector([getRequests], ({ habits }) => habits);

export const getHabitsLoading = createSelector(
  [getHabitsRequest],
  ({ loading }) => loading
);

const getTemplateDetailsRequest = createSelector(
  [getRequests],
  ({ templateDetails }) => templateDetails
);

export const getTemplateDetailsLoading = createSelector(
  [getTemplateDetailsRequest],
  ({ loading }) => loading
);

const getGlobalTemplatesRequest = createSelector(
  [getRequests],
  ({ globalTemplates }) => globalTemplates
);

export const getGlobalTemplatesLoading = createSelector(
  [getGlobalTemplatesRequest],
  ({ loading }) => loading
);

const getUserGroupsRequest = createSelector(
  [getRequests],
  ({ userGroups }) => userGroups
);

export const getUserGroupsLoading = createSelector(
  [getUserGroupsRequest],
  ({ loading }) => loading
);

const getMyGroupsRequest = createSelector(
  [getRequests],
  ({ myGroups }) => myGroups
);

export const getMyGroupsLoading = createSelector(
  [getMyGroupsRequest],
  ({ loading }) => loading
);

export const getGroupAdminsRequest = createSelector(
  [getRequests],
  ({ groupAdmins }) => groupAdmins
);
export const getGroupsInvitesRequest = createSelector(
  [getRequests],
  ({ groupsInvites }) => groupsInvites
);

export const getGroupsInvitesLoading = createSelector(
  [getGroupsInvitesRequest],
  ({ loading }) => loading
);

export const getChallengesInvitesRequest = createSelector(
  [getRequests],
  ({ challengesInvites }) => challengesInvites
);

export const getChallengesInvitesLoading = createSelector(
  [getChallengesInvitesRequest],
  ({ loading }) => loading
);

export const getGroupAdminsLoading = createSelector(
  [getGroupAdminsRequest],
  ({ loading }) => loading
);

export const groupMembersRequest = createSelector(
  [getRequests],
  ({ createEvent }) => createEvent
);

export const getGroupMembersLoading = createSelector(
  [groupMembersRequest],
  ({ loading }) => loading
);

const getMultiGroupsRequest = createSelector(
  [getRequests],
  ({ multiGroups }) => multiGroups
);

const getMultiUsersRequest = createSelector(
  [getRequests],
  ({ multiUsers }) => multiUsers
);

const getAllMultiGroupsLoading = createSelector(
  [getMultiGroupsRequest],
  ({ loading }) => loading
);

const getAllMultiGroupsLoaded = createSelector(
  [getMultiGroupsRequest],
  ({ loaded }) => loaded
);

const getAllMultiUsersLoading = createSelector(
  [getMultiUsersRequest],
  ({ loading }) => loading
);

const getAllMultiUsersLoaded = createSelector(
  [getMultiUsersRequest],
  ({ loaded }) => loaded
);

export const getMultiGroupsLoading = createSelector(
  [getAllMultiGroupsLoading, getIdFromProps],
  (loading, id) => loading.includes(id)
);

export const getMultiUsersLoading = createSelector(
  [getAllMultiUsersLoading, getIdFromProps],
  (loading, id) => loading.includes(id)
);

export const getMultiGroupsLoaded = createSelector(
  [getAllMultiGroupsLoaded, getIdFromProps],
  (loaded, id) => loaded.includes(id)
);

export const getMultiUsersLoaded = createSelector(
  [getAllMultiUsersLoaded, getIdFromProps],
  (loaded, id) => loaded.includes(id)
);

export const groupTemplatesRequest = createSelector(
  [getRequests],
  ({ groupTemplates }) => groupTemplates
);

export const getGroupTemplatesLoading = createSelector(
  [groupTemplatesRequest],
  ({ loading }) => loading
);

export const getGroupTemplatesLoaded = createSelector(
  [groupTemplatesRequest],
  ({ loaded }) => loaded
);

export const getChallengeConfirmationsRequest = createSelector(
  [getRequests],
  ({ challengeConfirmations }) => challengeConfirmations
);

export const getChallengeConfirmationsLoading = createSelector(
  [getChallengeConfirmationsRequest],
  ({ loading }) => loading
);

export const getChallengeCheckinsRequest = createSelector(
  [getRequests],
  ({ challengeCheckins }) => challengeCheckins
);

export const getChallengeCheckinsLoading = createSelector(
  [getChallengeCheckinsRequest],
  ({ loading }) => loading
);

export const getChallengeCheckinsLoaded = createSelector(
  [getChallengeCheckinsRequest],
  ({ loaded }) => loaded
);

export const getChallengeConfirmationsLoaded = createSelector(
  [getChallengeConfirmationsRequest],
  ({ loaded }) => loaded
);

export const getFlashChallengeListRequest = createSelector(
  [getRequests],
  ({ flashChallengesList }) => flashChallengesList
);

export const getFlashChallengeListLoaded = createSelector(
  [getFlashChallengeListRequest],
  ({ loaded }) => loaded
);

export const getFlashChallengeListLoading = createSelector(
  [getFlashChallengeListRequest],
  ({ loading }) => loading
);

export const getLoadingJoinFlashChallengeRequest = createSelector(
  [getRequests],
  ({ joinFlashChallenge }) => joinFlashChallenge
);

export const getLoadingJoinFlashChallenge = createSelector(
  [getLoadingJoinFlashChallengeRequest],
  ({ loading }) => loading
);

export const getLoadingJoinRegularChallengeRequest = createSelector(
  [getRequests],
  ({ joinRegularChallenge }) => joinRegularChallenge
);

export const getLoadingJoinRegularChallenge = createSelector(
  [getLoadingJoinRegularChallengeRequest],
  ({ loading }) => loading
);

export const getLoadingLeaveChallengeRequest = createSelector(
  [getRequests],
  ({ leaveChallenge }) => leaveChallenge
);

export const getLoadingLeaveChallenge = createSelector(
  [getLoadingLeaveChallengeRequest],
  ({ loading }) => loading
);

const getMultiChallengesRequest = createSelector(
  [getRequests],
  ({ multiChallenges }) => multiChallenges
);

const getAllMultiChallengesLoading = createSelector(
  [getMultiChallengesRequest],
  ({ loading }) => loading
);

export const getMultiChallengesLoading = createSelector(
  [getAllMultiChallengesLoading, getIdFromProps],
  (loading, id) => loading.includes(id)
);

const getAllMultiChallengesLoaded = createSelector(
  [getMultiUsersRequest],
  ({ loaded }) => loaded
);

export const getMultiChallengesLoaded = createSelector(
  [getAllMultiChallengesLoaded, getIdFromProps],
  (loaded, id) => loaded.includes(id)
);

export const createChallengeRequest = createSelector(
  [getRequests],
  ({ createChallenge }) => createChallenge
);

export const getCreateChallengeLoading = createSelector(
  [createChallengeRequest],
  ({ loading }) => loading
);

export const deleteChallengeRequest = createSelector(
  [getRequests],
  ({ deleteChallenge }) => deleteChallenge
);

export const getDeleteChallengeLoading = createSelector(
  [deleteChallengeRequest],
  ({ loading }) => loading
);

export const challengePlanCalendarRequest = createSelector(
  [getRequests],
  ({ challengePlan }) => challengePlan
);

export const getChallengePlanLoading = createSelector(
  [challengePlanCalendarRequest],
  ({ loading }) => loading
);

export const challengesRequest = createSelector(
  [getRequests],
  ({ challenges }) => challenges
);

export const getChallengesLoading = createSelector(
  [challengesRequest],
  ({ loading }) => loading
);

export const challengesForInvitesRequest = createSelector(
  [getRequests],
  ({ challengesForInvites }) => challengesForInvites
);

export const getChallengesForInvitesLoading = createSelector(
  [challengesForInvitesRequest],
  ({ loading }) => loading
);

export const challengesDetaisRequest = createSelector(
  [getRequests],
  ({ challengeDetails }) => challengeDetails
);

export const getChallengesDetailsLoading = createSelector(
  [challengesDetaisRequest],
  ({ loading }) => loading
);

export const challengesMembersRequest = createSelector(
  [getRequests],
  ({ challengeMembers }) => challengeMembers
);

export const getChallengeMembersLoading = createSelector(
  [challengesMembersRequest],
  ({ loading }) => loading
);

export const fetchPostsRequest = createSelector(
  [getRequests],
  ({ fetchPosts }) => fetchPosts
);

export const getPostsLoading = createSelector(
  [fetchPostsRequest],
  ({ loading }) => loading
);
