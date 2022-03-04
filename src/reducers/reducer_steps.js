import { SET_STEP } from '../constants';

export default (
  state = {
    step_lvl_1: 0,
    step_lvl_2: 1,
    maxSteps_1: 10,
    maxSteps_2: 5,
  },
  action
) => {
  switch (action.type) {
    case SET_STEP:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
