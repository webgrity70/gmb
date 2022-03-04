import { createSelector } from 'redux-starter-kit';
import sum from 'lodash/sum';

const getMessageIdFromProps = (state, props) => props.messageId;
const getChallengesChatPagination = (state) => state.pagination.challengesChat;
const getChallengeThreadHistoryState = (state) => state.challengesChat.history;
const getChallengeIdFromProps = (state, props) => props.challengeId;

export const getSelectedChallengeThreadId = createSelector(
  ['challengesChat.selectedThread'],
  (id) => id
);

const getChallengeThreadHistoryBydId = createSelector(
  [getChallengeThreadHistoryState, getSelectedChallengeThreadId],
  (history, challengeId) => history[challengeId]
);

export const getChallengesThreadsPaginationNextUrl = createSelector(
  [getChallengesChatPagination],
  (pagination = {}) => pagination.next
);

export const getChallengeThreadHistoryMessages = createSelector(
  [getChallengeThreadHistoryBydId],
  (history = {}) => history.messages
);

export const getChallengeThreadHistoryNextUrl = createSelector(
  [getChallengeThreadHistoryBydId],
  (history = {}) => history.next
);

export const getChatChallengesThreads = createSelector(
  ['challengesChat.threads'],
  (threads) => threads
);

export const getSelectedChallengeThread = createSelector(
  [getChatChallengesThreads, getSelectedChallengeThreadId],
  (threads, threadId) => threads[threadId]
);

export const getChatChallengesThreadsList = createSelector(
  [getChatChallengesThreads],
  (threads = {}) =>
    Object.values(threads).sort((a, b) => {
      if (!a.muted && b.muted) return -1;
      return 1;
    })
);

const getChatChallengesThreadsRequestState = createSelector(
  ['requests.chatChallengesThreads'],
  (chatThreads) => chatThreads
);

export const getAreChatChallengesThreadsLoading = createSelector(
  [getChatChallengesThreadsRequestState],
  (request) => request.loading
);

const getChallengeThreadFromProps = createSelector(
  [getChatChallengesThreads, getChallengeIdFromProps],
  (threads = {}, challengeId) => threads[challengeId]
);

export const getChallengeThreadUnreadCountFromProps = createSelector(
  [getChallengeThreadFromProps],
  ({ unreadMessages }) => unreadMessages
);

export const getHasReachedChallengesPaginationEnd = createSelector(
  [getChallengesThreadsPaginationNextUrl],
  (next) => next === null
);

const getChallengeMessagesState = (state) => state.challengesChat.messages;

const getChallengeMessagesById = createSelector(
  [getChallengeMessagesState, getSelectedChallengeThreadId],
  (challenges, challengeId) => challenges[challengeId]
);

export const getChallengeMessageById = createSelector(
  [getChallengeMessagesById, getMessageIdFromProps],
  (messages = {}, messageId) => messages[messageId]
);

export const getHasReachedChallengeThreadEnd = createSelector(
  [getChallengeThreadHistoryNextUrl],
  (next) => next === null
);

const getChallengeChatMeta = createSelector(
  ['challengesChat.meta', getSelectedChallengeThreadId],
  (meta, challengeId) => meta[challengeId]
);

export const getChallengeThreadLastReadMessageId = createSelector(
  [getChallengeChatMeta],
  (challenge = {}) => challenge.lastReadMessage
);

export const getAllChallengesUnreadCount = createSelector(
  [getChatChallengesThreads],
  (threads) =>
    sum(Object.values(threads).map(({ unreadMessages }) => unreadMessages))
);

export const getChallengeMembership = createSelector(
  [getChatChallengesThreads, getChallengeIdFromProps],
  (threads = {}, challengeId) => threads[challengeId]
);
