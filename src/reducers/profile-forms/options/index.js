import { combineReducers } from 'redux';
import occupation from './occupation';
import educationLevel from './educationLevel';
import currentSchoolYear from './currentSchoolYear';
import negativeBehaviour from './negativeBehaviour';

const entitiesReducer = combineReducers({
  occupation,
  educationLevel,
  currentSchoolYear,
  negativeBehaviour,
});

export default entitiesReducer;
