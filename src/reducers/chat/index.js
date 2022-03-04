import { combineReducers } from 'redux';
import messages from './messages';
import meta from './meta';
import threads from './threads';
import history from './history';
import selectedThread from './selectedThread';

const groupChatReducer = combineReducers({
  messages,
  meta,
  history,
  threads,
  selectedThread,
});

export default groupChatReducer;
