import { combineReducers } from 'redux';
import list from './list';
import details from './details';
import confirmations from './confirmations';
import checkins from './checkins';
import calendar from './calendar';
import members from './members';

const userReducer = combineReducers({
  list,
  details,
  checkins,
  calendar,
  members,
  confirmations,
});

export default userReducer;
