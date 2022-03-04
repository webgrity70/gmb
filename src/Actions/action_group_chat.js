import { createAction } from 'redux-starter-kit';
import { makeFetchAction } from './utils';
import SidebarService from '../Services/SideBarService';
import GroupChatService from '../Services/GroupChatService';
import {
  getGroupThreadHistoryNextUrl,
  getGroupsPaginationNextUrl,
  getGroupThreadHistoryMessages,
  getJoinableGroupsPaginationNextUrl,
} from '../selectors/groupChat';
import { authenticatedGet } from '../utils/fetch';
import GroupsService from '../Services/GroupsService';

export const notifyMessageReceived = createAction(
  '[GROUP_CHAT] NOTIFY_MESSAGE_RECEIVED'
);
export const showThreads = createAction('[GROUP_CHAT] SHOW_THREADS');
export const selectThread = createAction('[GROUP_CHAT] SELECT_THREAD');

export const connectSocket = createAction('[GROUP_CHAT] CONNECT_SOCKET');
export const connectSocketSucceeded = createAction(
  '[GROUP_CHAT] CONNECT_SOCKET_SUCCEEDED'
);
export const connectSocketFailed = createAction(
  '[GROUP_CHAT] CONNECT_SOCKET_FAILED'
);

export const joinChatStarted = createAction('[GROUP_CHAT] JOIN_CHAT_STARTED');
export const joinChatSucceeded = createAction(
  '[GROUP_CHAT] JOIN_CHAT_SUCCEEDED'
);
export const joinChatFailed = createAction('[GROUP_CHAT] JOIN_CHAT_FAILED');

export const disconnectSocket = createAction('[GROUP_CHAT] DISCONNECT_SOCKET');
export const disconnectSocketSucceeded = createAction(
  '[GROUP_CHAT] DISCONNECT_SOCKET_SUCCEEDED'
);
export const disconnectSocketFailed = createAction(
  '[GROUP_CHAT] DISCONNECT_SOCKET_FAILED'
);

export const fetchGroupsThreadsStarted = createAction(
  '[GROUP_CHAT] FETCH_GROUPS_THREADS_STARTED'
);
export const fetchGroupsThreadsSucceeded = createAction(
  '[GROUP_CHAT] FETCH_GROUPS_THREADS_SUCCEEDED'
);
export const fetchGroupsThreadsFailed = createAction(
  '[GROUP_CHAT] FETCH_GROUPS_THREADS_FAILED'
);

export const fetchJoinableGroupsThreadsStarted = createAction(
  '[GROUP_CHAT] FETCH_JOINABLE_GROUPS_THREADS_STARTED'
);
export const fetchJoinableGroupsThreadsSucceeded = createAction(
  '[GROUP_CHAT] FETCH_JOINABLE-GROUPS_THREADS_SUCCEEDED'
);
export const fetchJoinableGroupsThreadsFailed = createAction(
  '[GROUP_CHAT] FETCH_JOINABLE_GROUPS_THREADS_FAILED'
);

export const fetchThreadMessagesStarted = createAction(
  '[GROUP_CHAT] FETCH_THREAD_MESSAGES'
);
export const fetchThreadMessagesSucceeded = createAction(
  '[GROUP_CHAT] FETCH_THREAD_MESSAGES_SUCCEEDED'
);
export const fetchThreadMessagesFailed = createAction(
  '[GROUP_CHAT] FETCH_THREAD_MESSAGES_FAILED'
);

export const resetThread = createAction('[GROUP_CHAT] RESET_THREAD');
export const messageReceived = createAction('[GROUP_CHAT] MESSAGE_RECEIVED');

export function fetchThreadMessages(groupId) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchThreadMessagesStarted({ groupId }));
    const nextUrl = getGroupThreadHistoryNextUrl(state, { groupId });
    if (nextUrl === null) {
      return;
    }
    try {
      let data;
      if (nextUrl === undefined) {
        data = await GroupChatService.getThreadMessages(groupId);
      } else {
        data = await authenticatedGet(nextUrl);
      }
      dispatch(fetchThreadMessagesSucceeded({ groupId, data }));
    } catch (e) {
      dispatch(fetchThreadMessagesFailed({ groupId, error: e }));
    }
  };
}

export const setLastReadMessage = createAction(
  '[GROUP_CHAT] SET_LAST_READ_MESSAGE'
);

export function initThread(groupId) {
  return async (dispatch, getState) => {
    dispatch(resetThread({ groupId }));
    await dispatch(fetchThreadMessages(groupId));
    const messages =
      getGroupThreadHistoryMessages(getState(), { groupId }) || [];
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      dispatch(setLastReadMessage({ groupId, messageId: lastMessage }));
    }
    dispatch(connectSocket({ groupId }));
    dispatch(selectThread({ groupId }));
  };
}

export function fetchGroupsThreads({ usePagination }) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchGroupsThreadsStarted());
    const nextUrl = getGroupsPaginationNextUrl(state);
    try {
      let data;
      if (nextUrl && usePagination) {
        data = await authenticatedGet(nextUrl);
      } else {
        data = await SidebarService.getGroupsThreads();
      }
      dispatch(fetchGroupsThreadsSucceeded(data));
    } catch (e) {
      dispatch(fetchGroupsThreadsFailed(e));
    }
  };
}

export function fetchJoinableGroupsThreads({ usePagination }) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchJoinableGroupsThreadsStarted());
    const nextUrl = getJoinableGroupsPaginationNextUrl(state);
    try {
      let data;
      if (nextUrl && usePagination) {
        data = await authenticatedGet(nextUrl);
      } else {
        data = await SidebarService.getJoinableGroupsThreads();
      }
      dispatch(fetchJoinableGroupsThreadsSucceeded(data));
    } catch (e) {
      dispatch(fetchJoinableGroupsThreadsFailed(e));
    }
  };
}

export const muteChat = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'MUTE_CHAT_GROUP',
  fetchData: GroupsService.muteChat,
  onSucceedPayload: (args) => args[0],
});

export const sendMessage = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'SEND_MESSAGE',
  fetchData: GroupsService.sendMessage,
});

export function joinChat(groupId) {
  return async (dispatch) => {
    dispatch(joinChatStarted());
    try {
      const data = await GroupsService.joinChat(groupId);
      dispatch(joinChatSucceeded({ ...data, groupId }));
    } catch (e) {
      dispatch(joinChatFailed(e));
    }
  };
}

export const leaveChat = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'LEAVE_CHAT_GROUP',
  fetchData: GroupsService.leaveChat,
  onSucceedPayload: (args) => args[0],
});
