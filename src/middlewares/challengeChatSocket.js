import { toast } from 'react-toastify';
import * as challengeChatActions from '../Actions/actions_challenges_chat';
import * as userActions from '../Actions/actions_user';
import { WEBSOCKET_URI } from '../settings';
import { TrackEvent } from '../Services/TrackEvent';

export default function challengeChatSocketMiddleware({ dispatch }) {
  const challengeSocket = {};
  function connectSocket(challengeId, timeout = 250) {
    const token = localStorage.getItem('access_token');
    const socket = new WebSocket(
      `${WEBSOCKET_URI}challenge-thread/${challengeId}/?token=${token}`
    );
    challengeSocket[challengeId] = socket;

    socket.onopen = () => {
      dispatch(challengeChatActions.connectSocketSucceeded({ challengeId }));
    };

    socket.onerror = () => {
      dispatch(challengeChatActions.connectSocketFailed({ challengeId }));
    };

    socket.onclose = (e) => {
      if (e.code !== 1000) {
        setTimeout(() => {
          connectSocket(challengeId, Math.min(10000, timeout * 2));
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
      if (payload && payload.type === 'challenge_chat_message') {
        dispatch(
          challengeChatActions.messageReceived({
            challengeId,
            message: payload.message,
          })
        );
      }
    };
  }

  return (next) => async (action) => {
    if (action.type === challengeChatActions.connectSocket.type) {
      next(action);
      const { challengeId } = action.payload;

      if (challengeSocket[challengeId]) {
        return;
      }

      connectSocket(challengeId);
    } else if (action.type === challengeChatActions.disconnectSocket.type) {
      next(action);
      const { challengeId } = action.payload;
      const socket = challengeSocket[challengeId];
      if (!socket) {
        return;
      }
      socket.close();
      delete challengeSocket[challengeId];
      dispatch(challengeChatActions.disconnectSocketSucceeded({ challengeId }));
    } else if (action.type === challengeChatActions.sendMessage.type) {
      next(action);
      const { challengeId, message } = action.payload;
      const socket = challengeSocket[challengeId];
      if (!socket) {
        const error = 'You have been disconnected from chat';
        TrackEvent('challenge-chat-error', { message: error });
        dispatch(
          challengeChatActions.messageReceived({
            challengeId,
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
        TrackEvent('challenge-chat-error', { message: error });
        dispatch(
          challengeChatActions.messageReceived({
            challengeId,
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
      const activechallengeSockets = Object.keys(challengeSocket).map((id) =>
        parseInt(id, 10)
      );
      activechallengeSockets.forEach((challengeId) => {
        dispatch(challengeChatActions.disconnectSocket({ challengeId }));
      });
    } else if (action.type === challengeChatActions.leaveChat.succeeded) {
      next(action);
      const { challengeId } = action.payload;
      const socket = challengeSocket[challengeId];
      if (!socket) {
        return;
      }
      socket.close();
      dispatch(challengeChatActions.disconnectSocket({ challengeId }));
      delete challengeSocket[challengeId];
    } else {
      next(action);
    }
  };
}
