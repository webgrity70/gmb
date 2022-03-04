import { combineReducers } from 'redux';
import users from './user';
import groups from './groups';
import languages from './languages';
import groupsLevels from './groupsLevels';
import apps from './apps';
import globalTemplates from './globalTemplates';
import psychology from './psychology';
import categories from './categories';
import templates from './templates';
import calendar from './calendar';
import events from './events';
import plans from './plans';
import templatesDetails from './templatesDetails';
import challenges from './challenges';

const entitiesReducer = combineReducers({
  users,
  groups,
  languages,
  calendar,
  groupsLevels,
  apps,
  psychology,
  categories,
  templates,
  events,
  plans,
  challenges,
  templatesDetails,
  globalTemplates,
});

export default entitiesReducer;
