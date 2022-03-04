import { REGISTER_FORM } from '../constants';

export default (state = [], action) => {
  switch (action.type) {
    case REGISTER_FORM:
      return action.payload;
    default:
      return state;
  }
};
