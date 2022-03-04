import { toast } from 'react-toastify';
import * as groupChatActions from '../Actions/action_group_chat';
import * as userActions from '../Actions/actions_user';
import { WEBSOCKET_URI } from '../settings';
import { TrackEvent } from '../Services/TrackEvent';

export default function groupChatSocketMiddleware({ dispatch }) {
  const groupSocket = {};
  function connectSocket(groupId, timeout = 250) {
    const token = localStorage.getItem('access_token');
    const socket = new WebSocket(
      `${WEBSOCKET_URI}group-thread/${groupId}/?token=${token}`
    );
    groupSocket[groupId] = socket;

    socket.onopen = () => {
      dispatch(groupChatActions.connectSocketSucceeded({ groupId }));
    };

    socket.onerror = () => {
      dispatch(groupChatActions.connectSocketFailed({ groupId }));
    };

    socket.onclose = (e) => {
      if (e.code !== 1000) {
        setTimeout(() => {
          connectSocket(groupId, Math.min(10000, timeout * 2));
        }, timeout);
      } else if (e.code !== 1006 && e.code !== 1000) {
        toast.error('Chat socket closed unexpectedly');
      }
    };

    socket.onmessage = (ev) => {
      let payload;
      try {
        payload = JSON.parse(ev.data);
      } catch (e) {
        payload = null;
      }
      if (payload && payload.type === 'group_chat_message') {
        dispatch(
          groupChatActions.messageReceived({
            groupId,
            message: payload.message,
          })
        );
      }
    };
  }

  return (next) => async (action) => {
    if (action.type === groupChatActions.connectSocket.type) {
      next(action);
      const { groupId } = action.payload;

      if (groupSocket[groupId]) {
        return;
      }

      connectSocket(groupId);
    } else if (action.type === groupChatActions.disconnectSocket.type) {
      next(action);
      const { groupId } = action.payload;
      const socket = groupSocket[groupId];
      if (!socket) {
        return;
      }
      socket.close();
      delete groupSocket[groupId];
      dispatch(groupChatActions.disconnectSocketSucceeded({ groupId }));
    } else if (action.type === groupChatActions.sendMessage.type) {
      next(action);
      const { groupId, message } = action.payload;
      const socket = groupSocket[groupId];
      if (!socket) {
        const error = 'You have been disconnected from chat';
        TrackEvent('group-chat-error', { message: error });
        dispatch(
          groupChatActions.messageReceived({
            groupId,
            message: {
              id: Date.now(),
              message: error,
              sentOn: new Date().toISOString(),
              sentBy: {},
            },
          })
        );
        return;
      }
      try {
        socket.send(JSON.stringify({ message }));
      } catch (e) {
        const errStr = JSON.stringify(e);
        const error = errStr === '{}' ? `${e}` : errStr;
        TrackEvent('group-chat-error', { message: error });
        dispatch(
          groupChatActions.messageReceived({
            groupId,
            message: {
              id: Date.now(),
              message: error,
              sentOn: new Date().toISOString(),
              sentBy: {},
            },
          })
        );
      }
    } else if (action.type === userActions.logout.type) {
      next(action);
      const activeGroupSockets = Object.keys(groupSocket).map((id) =>
        parseInt(id, 10)
      );
      activeGroupSockets.forEach((groupId) => {
        dispatch(groupChatActions.disconnectSocket({ groupId }));
      });
    } else if (action.type === groupChatActions.leaveChat.succeeded) {
      next(action);
      const { groupId } = action.payload;
      const socket = groupSocket[groupId];
      if (!socket) {
        return;
      }
      socket.close();
      dispatch(groupChatActions.disconnectSocket({ groupId }));
      delete groupSocket[groupId];
    } else {
      next(action);
    }
  };
}
