import * as userActions from '../Actions/actions_user';
import * as groupChatActions from '../Actions/action_group_chat';
import * as chatActions from '../Actions/action_chat';
import { WEBSOCKET_URI } from '../settings';
import { getChatThreads } from '../selectors/chat';

export default function userSocketMiddleware({ dispatch, getState }) {
  let userSocket = null;

  function connectSocket(timeout = 250) {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return;
    }
    const socket = new WebSocket(`${WEBSOCKET_URI}user/?token=${token}`);
    userSocket = socket;

    socket.onopen = () => {
      dispatch(userActions.connectSocketSucceeded());
    };

    socket.onerror = () => {
      dispatch(userActions.connectSocketFailed());
    };

    socket.onclose = (e) => {
      if (e.code !== 1000) {
        setTimeout(() => {
          connectSocket(Math.min(10000, timeout * 2));
        }, timeout);
      }
    };

    socket.onmessage = (ev) => {
      let payload;
      try {
        payload = JSON.parse(ev.data);
      } catch (e) {
        payload = null;
      }
      if (payload && payload.type === 'new_chat_message') {
        const state = getState();
        const threads = getChatThreads(state);
        if (!threads[payload.message.threadID]) {
          dispatch(chatActions.fetchThreads());
        }
      } else if (payload && payload.type === 'new_group_message') {
        dispatch(
          groupChatActions.notifyMessageReceived({ groupId: payload.group_id })
        );
      }
    };
  }

  return (next) => async (action) => {
    if (action.type === userActions.fetchUserData.succeeded.type) {
      next(action);
      dispatch(userActions.connectSocket());
    } else if (action.type === userActions.connectSocket.type) {
      next(action);
      if (userSocket) {
        return;
      }

      connectSocket();
    } else if (action.type === userActions.disconnectSocket.type) {
      next(action);
      if (!userSocket) {
        return;
      }
      userSocket.close();
      userSocket = null;
      dispatch(userActions.disconnectSocketSucceeded());
    } else if (action.type === userActions.logout.type) {
      next(action);
      dispatch(userActions.disconnectSocket());
    } else {
      next(action);
    }
  };
}
