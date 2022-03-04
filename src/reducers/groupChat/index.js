import { combineReducers } from 'redux';
import messages from './messages';
import meta from './meta';
import history from './history';
import threads from './threads';
import selectedThread from './selectedThread';

const groupChatReducer = combineReducers({
  messages,
  meta,
  history,
  threads,
  selectedThread,
});

export default groupChatReducer;
