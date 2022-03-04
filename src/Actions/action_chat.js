/* eslint-disable import/no-named-as-default-member */
import { createAction } from 'redux-starter-kit';
import SidebarService from '../Services/SideBarService';
import { authenticatedGet } from '../utils/fetch';
import { makeFetchAction } from './utils';
import { getChatThreadHistoryNextUrl } from '../selectors/chat';

export const fetchThreads = makeFetchAction({
  actionGroup: 'CHAT',
  action: 'FETCH_THREADS',
  fetchData: SidebarService.getThreads,
});

export const setThreadAsRead = makeFetchAction({
  actionGroup: 'CHAT',
  action: 'SET_THREAD_AS_READ',
  fetchData: SidebarService.setThreadAsRead,
  onSucceedPayload: (args) => ({
    threadId: args[0],
  }),
  onErrorPayload: (args) => ({
    threadId: args[0],
  }),
});

export const showThreads = createAction('[CHAT] SHOW_THREADS');
export const selectThread = createAction('[CHAT] SELECT_THREAD');

export const connectSocket = createAction('[CHAT] CONNECT_SOCKET');
export const connectSocketSucceeded = createAction(
  '[CHAT] CONNECT_SOCKET_SUCCEEDED'
);
export const connectSocketFailed = createAction('[CHAT] CONNECT_SOCKET_FAILED');

export const disconnectSocket = createAction('[CHAT] DISCONNECT_SOCKET');
export const disconnectSocketSucceeded = createAction(
  '[CHAT] DISCONNECT_SOCKET_SUCCEEDED'
);
export const disconnectSocketFailed = createAction(
  '[CHAT] DISCONNECT_SOCKET_FAILED'
);

export const fetchThreadMessagesStarted = createAction(
  '[CHAT] FETCH_THREAD_MESSAGES'
);
export const fetchThreadMessagesSucceeded = createAction(
  '[CHAT] FETCH_THREAD_MESSAGES_SUCCEEDED'
);
export const fetchThreadMessagesFailed = createAction(
  '[CHAT] FETCH_THREAD_MESSAGES_FAILED'
);

export const sendMessage = createAction('[CHAT] SEND_MESSAGE');
export const resetThread = createAction('[CHAT] RESET_THREAD');
export const messageReceived = createAction('[CHAT] MESSAGE_RECEIVED');

export const messageDraftChanged = createAction('[CHAT] MESSAGE_DRAFT_CHANGED');

export function fetchThreadMessages(threadId) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchThreadMessagesStarted({ threadId }));
    const nextUrl = getChatThreadHistoryNextUrl(state, { threadId });
    if (nextUrl === null) {
      return;
    }
    try {
      let data;
      if (nextUrl === undefined) {
        data = await SidebarService.getMessages(threadId);
      } else {
        data = await authenticatedGet(nextUrl);
      }
      dispatch(fetchThreadMessagesSucceeded({ threadId, data }));
    } catch (e) {
      dispatch(fetchThreadMessagesFailed({ threadId, error: e }));
    }
  };
}

export const leaveChat = makeFetchAction({
  actionGroup: 'CHAT',
  action: 'LEAVE_THREAD',
  fetchData: SidebarService.leaveChat,
  onSucceedPayload: (args) => args[0],
});
