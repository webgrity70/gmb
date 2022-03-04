import { createSelector } from 'redux-starter-kit';
import get from 'lodash/get';

const membersPagination = (state) => get(state, 'pagination.groupMembers', {});
const getIdFromProps = (state, props) => props.id;
const getGroupIdFromProps = (state, { groupId }) => groupId;

export const getGroups = (state) => state.entities.groups;
export const getCurrentGroupMembers = (state) =>
  get(state, 'group.members', []);
export const getCurrentGroupPosts = (state) => get(state, 'group.posts', []);
export const getLevels = (state) => Object.values(state.entities.groupsLevels);
export const getCurrentGroupAnnouncements = (state) =>
  get(state, 'group.announcements', []);
export const getError = (state) => get(state, 'requests.groups.error');
export const getGroupAdmins = (state) => get(state, 'group.admins', []);
const getGroupTemplates = (state) => get(state, 'group.templates', {});

const getGroupsPagination = (state) => state.pagination.groups;

const getGroupsMembersPagination = (state) => state.pagination.groupMembers;

const getPendingPrivateMembersPagination = (state) =>
  state.pagination.groupPendingPrivateMembers;

const getCurrentGroup = (state) => get(state, 'group', {});

export const getPPMNext = createSelector(
  [getPendingPrivateMembersPagination],
  ({ next }) => next
);

export const getPPMCount = createSelector(
  [getPendingPrivateMembersPagination],
  ({ count }) => count
);

export const getPPMembers = createSelector(
  [getCurrentGroup],
  ({ pendingPrivateMembers }) => pendingPrivateMembers
);

export const getPaginationOrder = createSelector(
  [getGroupsPagination],
  ({ order }) => order
);

export const getMembersPaginationOrder = createSelector(
  [getGroupsMembersPagination],
  ({ order }) => order
);
export const getPaginationFilters = createSelector(
  [getGroupsPagination],
  ({ filters }) => filters
);

export const getPaginationSearch = createSelector(
  [getGroupsPagination],
  ({ q }) => q
);

export const getMembersPaginationSearch = createSelector(
  [getGroupsMembersPagination],
  ({ input }) => input
);

export const getMembersPaginationFilters = createSelector(
  [getGroupsMembersPagination],
  ({ filters }) => filters
);

export const getPaginationOrderName = createSelector(
  [getGroupsPagination],
  ({ order }) => (order && order.charAt(0) === '-' ? order.slice(1) : order)
);

const entriesInPagination = createSelector(
  [getGroupsPagination],
  ({ pagination }) => pagination
);

export const getGroup = createSelector(
  [getGroups, getGroupIdFromProps],
  (groups, groupId) => {
    const group = groups[groupId];
    return group;
  }
);

export const getFullGroup = createSelector([getGroup], (group) => {
  if (group && group.fullContent) return group;
  return undefined;
});

export const getNextLevel = createSelector(
  [getLevels, (state, groupLevel) => groupLevel],
  (levels, groupLevel) => {
    const nextLevel = levels.find(
      ({ xpRequirement }) => xpRequirement > groupLevel
    );
    return nextLevel;
  }
);

export const getAllGroups = createSelector([getGroups], (groups) =>
  Object.values(groups)
);

export const getPaginatedGroups = createSelector(
  [getGroups, entriesInPagination],
  (groups, pagination) => Object.values(pagination.map((e) => groups[e]))
);

export const getOrderDirection = createSelector(
  [getPaginationOrder],
  (order) => {
    if (!order) return null;
    return order.charAt(0) === '-' ? 'descending' : 'ascending';
  }
);

export const getMembersOrderDirection = createSelector(
  [getMembersPaginationOrder],
  (order) => {
    if (!order) return null;
    return order.charAt(0) === '-' ? 'descending' : 'ascending';
  }
);

export const getMembersPaginationOrderName = createSelector(
  [getMembersPaginationOrder],
  (order) => (order && order.charAt(0) === '-' ? order.slice(1) : order)
);

export const getGroupsParams = createSelector(
  [getPaginationFilters, getPaginationOrder, getPaginationSearch],
  (filters, order, q) => ({
    ...(order && { order }),
    ...(q && { q }),
    filters,
  })
);

export const getGroupMembersParams = createSelector(
  [
    getMembersPaginationFilters,
    getMembersPaginationOrder,
    getMembersPaginationSearch,
  ],
  (filters, order, input) => ({
    ...(order && { order }),
    ...(input && { input }),
    filters,
  })
);
export const getMembersCount = createSelector(
  [membersPagination],
  ({ count }) => count
);

export const getGroupTemplatesIds = createSelector(
  [getGroupTemplates],
  (templates) => Object.keys(templates)
);

export const getGroupTemplate = createSelector(
  [getGroupTemplates, getIdFromProps],
  (templates, id) => templates[id]
);

export const isLoading = (state) => get(state, 'group.loading', false);

export const haveError = (state) => get(state, 'group.error', null);

export const isPosting = (state) => get(state, 'group.posting', false);

export const getNextMembersPage = (state) =>
  get(state, 'pagination.groupMembers.next');

export const getNextPage = (state) => get(state, 'pagination.groups.next');

export const getAnnouncementsNextPage = (state) =>
  get(state, 'pagination.groupAnnouncements.next');

export const postingAnnouncement = (state) =>
  get(state, 'requests.createAnnouncement.loading', false);

export const loadingPPM = (state) => get(state, 'requests.ppmStatus', []);
