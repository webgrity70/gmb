import { createAction } from 'redux-starter-kit';
import { makeFetchAction } from './utils';
import { authenticatedGet } from '../utils/fetch';
import {
  getChallengesThreadsPaginationNextUrl,
  getChallengeThreadHistoryNextUrl,
  getChallengeThreadHistoryMessages,
} from '../selectors/challengesChat';
import ChallengesService from '../Services/ChallengesService';
import { API_URI } from '../settings';

export const notifyMessageReceived = createAction(
  '[CHALLENGES] NOTIFY_MESSAGE_RECEIVED'
);

export const fetchChallengesThreadsStarted = createAction(
  '[CHALLENGES] FETCH_CHALLENGES_THREADS_STARTED'
);
export const fetchChallengesThreadsSucceeded = createAction(
  '[CHALLENGES] FETCH_CHALLENGES_THREADS_SUCCEEDED'
);
export const fetchChallengesThreadsFailed = createAction(
  '[CHALLENGES] FETCH_CHALLENGES_THREADS_FAILED'
);

export const resetThread = createAction('[CHALLENGES] RESET_THREAD');
export const messageReceived = createAction('[CHALLENGES] MESSAGE_RECEIVED');

export const fetchThreadMessagesStarted = createAction(
  '[CHALLENGES] FETCH_THREAD_MESSAGES'
);
export const fetchThreadMessagesSucceeded = createAction(
  '[CHALLENGES] FETCH_THREAD_MESSAGES_SUCCEEDED'
);
export const fetchThreadMessagesFailed = createAction(
  '[CHALLENGES] FETCH_THREAD_MESSAGES_FAILED'
);

export const connectSocket = createAction('[CHALLENGES] CONNECT_SOCKET');
export const connectSocketSucceeded = createAction(
  '[CHALLENGES] CONNECT_SOCKET_SUCCEEDED'
);
export const connectSocketFailed = createAction(
  '[CHALLENGES] CONNECT_SOCKET_FAILED'
);

export const disconnectSocket = createAction('[CHALLENGES] DISCONNECT_SOCKET');
export const disconnectSocketSucceeded = createAction(
  '[CHALLENGES] DISCONNECT_SOCKET_SUCCEEDED'
);
export const disconnectSocketFailed = createAction(
  '[CHALLENGES] DISCONNECT_SOCKET_FAILED'
);

export const showThreads = createAction('[CHALLENGES] SHOW_THREADS');
export const selectThread = createAction('[CHALLENGES] SELECT_THREAD');

export function fetchChallengesThreads({ usePagination }) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchChallengesThreadsStarted());
    const nextUrl = getChallengesThreadsPaginationNextUrl(state);
    try {
      let data;
      if (nextUrl && usePagination) {
        data = await authenticatedGet(nextUrl);
      } else {
        data = await ChallengesService.getChallengesThreads();
      }
      dispatch(fetchChallengesThreadsSucceeded(data));
    } catch (e) {
      dispatch(fetchChallengesThreadsFailed(e));
    }
  };
}

export const muteChat = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'MUTE_CHAT',
  fetchData: ChallengesService.muteChat,
  onSucceedPayload: (args) => args[0],
});

export const sendMessage = makeFetchAction({
  actionGroup: 'CHALLENGES',
  action: 'SEND_MESSAGE',
  fetchData: ChallengesService.sendMessage,
});

export const setLastReadMessage = createAction(
  '[CHALLENGES] SET_LAST_READ_MESSAGE'
);

export function fetchThreadMessages(challengeId) {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(fetchThreadMessagesStarted({ challengeId }));
    const nextUrl = getChallengeThreadHistoryNextUrl(state, { challengeId });
    if (nextUrl === null) {
      return;
    }
    try {
      let data;
      if (nextUrl === undefined) {
        data = await authenticatedGet(
          `${API_URI}v2/challenges/threads/${challengeId}/?page_size=10`
        );
      } else {
        data = await authenticatedGet(nextUrl);
      }
      dispatch(fetchThreadMessagesSucceeded({ challengeId, data }));
    } catch (e) {
      dispatch(fetchThreadMessagesFailed({ challengeId, error: e }));
    }
  };
}

export function initThread(challengeId) {
  return async (dispatch, getState) => {
    dispatch(resetThread({ challengeId }));
    await dispatch(fetchThreadMessages(challengeId));
    const messages =
      getChallengeThreadHistoryMessages(getState(), { challengeId }) || [];
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      dispatch(setLastReadMessage({ challengeId, messageId: lastMessage }));
    }
    dispatch(connectSocket({ challengeId }));
    dispatch(selectThread({ challengeId }));
  };
}

export const leaveChat = makeFetchAction({
  actionGroup: 'CHALLENGE',
  action: 'LEAVE_CHAT_CHALLENGE',
  fetchData: ChallengesService.leaveChat,
  onSucceedPayload: (args) => args[0],
});

export const contactOwner = makeFetchAction({
  actionGroup: 'GROUPS',
  action: 'CONTACT_OWNER',
  fetchData: ChallengesService.contactOwner,
});
