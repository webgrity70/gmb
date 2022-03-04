import { toast } from 'react-toastify';
import * as chatActions from '../Actions/action_chat';
import * as userActions from '../Actions/actions_user';
import { WEBSOCKET_URI } from '../settings';

export default function groupChatSocketMiddleware({ dispatch }) {
  const threadSocket = {};

  function connectSocket(threadId, timeout = 250) {
    const token = localStorage.getItem('access_token');
    const socket = new WebSocket(
      `${WEBSOCKET_URI}thread/${threadId}/?token=${token}`
    );
    threadSocket[threadId] = socket;

    socket.onopen = () => {
      dispatch(chatActions.connectSocketSucceeded({ threadId }));
    };

    socket.onerror = () => {
      dispatch(chatActions.connectSocketFailed({ threadId }));
    };

    socket.onclose = (e) => {
      if (e.code !== 1000) {
        setTimeout(() => {
          connectSocket(threadId, Math.min(10000, timeout * 2));
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
      if (payload && payload.type === 'chat_message') {
        dispatch(
          chatActions.messageReceived({ threadId, message: payload.message })
        );
      }
    };
  }

  return (next) => async (action) => {
    if (action.type === chatActions.fetchThreads.succeeded.type) {
      next(action);
      const threads = action.payload;
      const activeThreads = new Set(
        Object.keys(threadSocket).map((id) => parseInt(id, 10))
      );
      await Promise.all(
        threads.map(async (thread) => {
          if (threadSocket[thread.id]) {
            activeThreads.delete(thread.id);
            return;
          }

          dispatch(chatActions.resetThread({ threadId: thread.id }));
          await dispatch(chatActions.fetchThreadMessages(thread.id));
          dispatch(chatActions.connectSocket({ threadId: thread.id }));
        })
      );

      activeThreads.forEach((threadId) => {
        dispatch(chatActions.disconnectSocket({ threadId }));
      });
    } else if (action.type === chatActions.connectSocket.type) {
      next(action);
      const { threadId } = action.payload;

      if (threadSocket[threadId]) {
        return;
      }

      connectSocket(threadId);
    } else if (action.type === chatActions.disconnectSocket.type) {
      next(action);
      const { threadId } = action.payload;
      const socket = threadSocket[threadId];
      if (!socket) {
        return;
      }
      socket.close();
      delete threadSocket[threadId];
      dispatch(chatActions.disconnectSocketSucceeded({ threadId }));
    } else if (action.type === chatActions.sendMessage.type) {
      next(action);
      const { threadId, message } = action.payload;
      const socket = threadSocket[threadId];
      if (!socket) {
        const error = 'You have been disconnected from chat';
        TrackEvent('chat-error', { message: error });
        dispatch(
          chatActions.messageReceived({
            threadId,
            message: {
              id: Date.now(),
              message: error,
              sentOn: new Date().toISOString(),
              threadId,
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
        TrackEvent('chat-error', { message: error });
        dispatch(
          chatActions.messageReceived({
            threadId,
            message: {
              id: Date.now(),
              message: error,
              sentOn: new Date().toISOString(),
              threadId,
            },
          })
        );
      }
    } else if (action.type === userActions.logout.type) {
      next(action);
      const activeThreads = Object.keys(threadSocket).map((id) =>
        parseInt(id, 10)
      );
      activeThreads.forEach((threadId) => {
        dispatch(chatActions.disconnectSocket({ threadId }));
      });
    } else if (action.type === chatActions.leaveChat) {
      next(action);
      const { threadId } = action.payload;
      const socket = threadSocket[threadId];
      if (!socket) {
        return;
      }
      socket.close();
      dispatch(chatActions.disconnectSocket({ threadId }));
      delete threadSocket[threadId];
    } else {
      next(action);
    }
  };
}
