import { combineReducers } from 'redux';
import info from './info';
import about from './about';
import apps from './apps';
import behaviours from './behaviours';
import groups from './groups';
import preferences from './preferences';
import psychology from './psychology';
import score from './score';
import categories from './categories';
import profile from './profile';
import recentBehaviors from './recentBehaviors';
import recentEventTemplates from './recentEventTemplates';

const userReducer = combineReducers({
  info,
  about,
  apps,
  behaviours,
  groups,
  preferences,
  psychology,
  score,
  categories,
  profile,
  recentBehaviors,
  recentEventTemplates,
});

export default userReducer;
