import { createSelector } from 'redux-starter-kit';
import sum from 'lodash/sum';

const getMessageIdFromProps = (state, props) => props.messageId;
const getGroupIdFromProps = (state, props) => props.groupId;
const getGroupsPagination = (state) => state.pagination.groupsChat;
const getJoinableGroupsPagination = (state) => state.pagination.joinableGroups;

export const getChatGroupsThreads = createSelector(
  ['groupChat.threads'],
  (threads) => threads
);

export const getChatGroupsThreadsList = createSelector(
  [getChatGroupsThreads],
  (threads = {}) =>
    Object.values(threads).sort((a, b) => {
      if (!a.muted && b.muted) return -1;
      return 1;
    })
);

const getChatGroupsThreadsRequestState = createSelector(
  ['requests.chatGroupsThreads'],
  (chatThreads) => chatThreads
);

const getChatJoinableGroupsThreadsRequestState = createSelector(
  ['requests.joinableGroups'],
  (chatThreads) => chatThreads
);

export const getSelectedGroupThreadId = createSelector(
  ['groupChat.selectedThread'],
  (id) => id
);

export const getAreChatGroupsThreadsLoading = createSelector(
  [getChatGroupsThreadsRequestState],
  (request) => request.loading
);

export const getAreChatJoinableGroupsThreadsLoading = createSelector(
  [getChatJoinableGroupsThreadsRequestState],
  (request) => request.loading
);

export const getSelectedGroupThread = createSelector(
  [getChatGroupsThreads, getSelectedGroupThreadId],
  (threads, threadId) => threads[threadId]
);

const getGroupChatMeta = createSelector(
  ['groupChat.meta', getSelectedGroupThreadId],
  (meta, groupId) => meta[groupId]
);

export const getIsGroupSocketConnected = createSelector(
  [getGroupChatMeta],
  (group = {}) => !!group.socketOnline
);

const getGroupMessagesState = (state) => state.groupChat.messages;
const getGroupMessagesById = createSelector(
  [getGroupMessagesState, getSelectedGroupThreadId],
  (groups, groupId) => groups[groupId]
);

export const getGroupMessageById = createSelector(
  [getGroupMessagesById, getMessageIdFromProps],
  (messages = {}, messageId) => messages[messageId]
);

const getGroupThreadHistoryState = (state) => state.groupChat.history;
const getGroupThreadHistoryBydId = createSelector(
  [getGroupThreadHistoryState, getSelectedGroupThreadId],
  (history, groupId) => history[groupId]
);

export const getGroupThreadHistoryMessages = createSelector(
  [getGroupThreadHistoryBydId],
  (history = {}) => history.messages
);

export const getGroupThreadHistoryPreviousUrl = createSelector(
  [getGroupThreadHistoryBydId],
  (history = {}) => history.prev
);

export const getGroupThreadHistoryNextUrl = createSelector(
  [getGroupThreadHistoryBydId],
  (history = {}) => history.next
);

export const getHasReachedGroupThreadEnd = createSelector(
  [getGroupThreadHistoryNextUrl],
  (next) => next === null
);

export const getGroupsPaginationNextUrl = createSelector(
  [getGroupsPagination],
  (pagination = {}) => pagination.next
);

export const getJoinableGroupsPaginationNextUrl = createSelector(
  [getJoinableGroupsPagination],
  (pagination = {}) => pagination.next
);

export const getHasReachedGroupsPaginationEnd = createSelector(
  [getGroupsPaginationNextUrl],
  (next) => next === null
);

export const getHasReachedJoinableGroupsPaginationEnd = createSelector(
  [getJoinableGroupsPaginationNextUrl],
  (next) => next === null
);

const getGroupThreadFromProps = createSelector(
  [getChatGroupsThreads, getGroupIdFromProps],
  (threads = {}, groupId) => threads[groupId]
);

export const getGroupThreadUnreadCountFromProps = createSelector(
  [getGroupThreadFromProps],
  ({ unreadMessages }) => unreadMessages
);

export const getAllGroupsUnreadCount = createSelector(
  [getChatGroupsThreads],
  (threads) => {
    const threadsValues = Object.values(threads).filter(
      ({ canJoin }) => !canJoin
    );
    return sum(threadsValues.map(({ unreadMessages }) => unreadMessages));
  }
);

export const getGroupThreadLastReadMessageId = createSelector(
  [getGroupChatMeta],
  (group = {}) => group.lastReadMessage
);

export const isAlreadyChatMember = createSelector(
  [getChatGroupsThreads, getGroupIdFromProps],
  (threads, groupId) => !!threads[groupId]
);

export const getGroupMembership = createSelector(
  [getChatGroupsThreads, getGroupIdFromProps],
  (threads, groupId) => threads[groupId]
);
