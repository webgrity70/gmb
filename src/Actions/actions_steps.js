import { SET_STEP } from '../constants';

export function setStepAction(steps) {
  const action = {
    type: SET_STEP,
    payload: steps,
  };
  return action;
}
export function setStep(steps) {
  return (dispatch, getState) => {
    dispatch(setStepAction(steps));
  };
}
