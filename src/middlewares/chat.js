import createHandlerMiddleware from 'redux-handler-middleware';
import * as chatActions from '../Actions/action_chat';
import * as challengeActions from '../Actions/actions_challenges_chat';
import * as groupChatActions from '../Actions/action_group_chat';

import { getSelectedGroupThreadId } from '../selectors/groupChat';
import { getSelectedThreadId } from '../selectors/chat';
import { getSelectedChallengeThreadId } from '../selectors/challengesChat';

export default createHandlerMiddleware([
  {
    action: chatActions.selectThread.type,
    beforeHandler: (store) => {
      const selectedGroupThread = getSelectedGroupThreadId(store.getState());
      const selectedChallengeThread = getSelectedChallengeThreadId(
        store.getState()
      );
      if (selectedGroupThread) {
        store.dispatch(groupChatActions.selectThread(null));
      }
      if (selectedChallengeThread) {
        store.dispatch(challengeActions.selectThread({ challengeId: null }));
      }
    },
  },
  {
    action: groupChatActions.selectThread.type,
    beforeHandler: (store) => {
      const selectedBuddyThread = getSelectedThreadId(store.getState());
      const selectedChallengeThread = getSelectedChallengeThreadId(
        store.getState()
      );
      if (selectedBuddyThread) {
        store.dispatch(chatActions.selectThread({ threadId: null }));
      }
      if (selectedChallengeThread) {
        store.dispatch(challengeActions.selectThread({ challengeId: null }));
      }
    },
  },
  {
    action: challengeActions.selectThread.type,
    beforeHandler: (store) => {
      const selectedBuddyThread = getSelectedThreadId(store.getState());
      const selectedGroupThread = getSelectedGroupThreadId(store.getState());

      if (selectedGroupThread) {
        store.dispatch(groupChatActions.selectThread(null));
      }
      if (selectedBuddyThread) {
        store.dispatch(chatActions.selectThread({ threadId: null }));
      }
    },
  },
]);
