import { createSelector } from 'redux-starter-kit';
import sum from 'lodash/sum';
import get from 'lodash/get';

const getMessageIdFromProps = (state, props) => props.messageId;
const getThreadIdFromProps = (state, props) => props.threadId;
const getChatThreadHistoryState = (state) => state.chat.history;

const getChatThreadsRequestState = createSelector(
  ['requests.chatThreads'],
  (chatThreads) => chatThreads
);

export const getAreChatThreadsLoading = createSelector(
  [getChatThreadsRequestState],
  (request) => request.loading
);

export const getChatThreads = createSelector(
  ['chat.threads'],
  (threads) => threads
);

const getChatThreadsOrdererIds = createSelector(
  [getChatThreadHistoryState, getChatThreads],
  (history, threads) =>
    Object.keys(threads)
      .map((id) => {
        const threadHistory = history[id];
        if (!threadHistory) return { id, lastMessage: 0 };
        const { messages } = threadHistory;
        const lastMessage =
          messages.length > 1
            ? messages[messages.length - 1]
            : get(messages, '0', 0);
        return { id, lastMessage };
      })
      .sort((a, b) => b.lastMessage - a.lastMessage)
      .map(({ id }) => id)
);

export const getChatThreadsList = createSelector(
  [getChatThreads, getChatThreadsOrdererIds],
  (threads, ordererIds) => {
    const buddiesChats = ordererIds.filter(
      (id) => threads[id].type === 'Buddy Chat'
    );
    const normalChats = ordererIds.filter((id) => !buddiesChats.includes(id));
    return [...buddiesChats, ...normalChats].map((id) => threads[id]);
  }
);

export const getSelectedThreadId = createSelector(
  ['chat.selectedThread'],
  (id) => id
);

export const getChatThreadById = createSelector(
  [getChatThreads, getThreadIdFromProps],
  (threads, threadId) => threads[threadId]
);

export const getSelectedThread = createSelector(
  [getChatThreads, getSelectedThreadId],
  (threads, threadId) => threads[threadId]
);

const getChatThreadMeta = createSelector(
  ['chat.meta', getThreadIdFromProps],
  (meta, threadId) => meta[threadId]
);

export const getIsChatThreadSocketConnected = createSelector(
  [getChatThreadMeta],
  (thread = {}) => !!thread.socketOnline
);

export const getChatThreadMessageDraft = createSelector(
  [getChatThreadMeta],
  (thread = {}) => thread.draft
);

const getChatThreadMessagesState = (state) => state.chat.messages;
const getChatThreadMessagesById = createSelector(
  [getChatThreadMessagesState, getThreadIdFromProps],
  (threads, threadId) => threads[threadId]
);

export const getChatThreadMessageById = createSelector(
  [getChatThreadMessagesById, getMessageIdFromProps],
  (messages = {}, messageId) => messages[messageId]
);

const getChatThreadHistoryBydId = createSelector(
  [getChatThreadHistoryState, getThreadIdFromProps],
  (history, threadId) => history[threadId]
);

export const getChatThreadHistoryMessages = createSelector(
  [getChatThreadHistoryBydId],
  (history = {}) => history.messages
);

export const getChatThreadHistoryPreviousUrl = createSelector(
  [getChatThreadHistoryBydId],
  (history = {}) => history.prev
);

export const getChatThreadHistoryNextUrl = createSelector(
  [getChatThreadHistoryBydId],
  (history = {}) => history.next
);

export const getHasReachedChatThreadEnd = createSelector(
  [getChatThreadHistoryNextUrl],
  (next) => next === null
);

export const getChatThreadUnreadCount = createSelector(
  [getChatThreadById],
  (thread = {}) => thread.newMessages || 0
);

export const getChatUnreadCount = (state) => {
  const threadIds = Object.keys(getChatThreads(state) || {});
  return sum(
    threadIds.map((id) => getChatThreadUnreadCount(state, { threadId: id }))
  );
};
