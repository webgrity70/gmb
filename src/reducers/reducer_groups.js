import {
  GET_ONE_GROUP,
  GET_MEMBERS_GROUP_SUCCESS,
  GET_MEMBERS_GROUP_ERROR,
} from '../constants';

const initialState = {
  groups: [],
  groupsList: [],
  members: [],
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ONE_GROUP:
      return groups.map((e) => {
        if (e.id === action.payload.id) {
          return action.payload;
        }
        return e;
      });
    case GET_MEMBERS_GROUP_SUCCESS:
      return { ...state, members: action.payload };
    case GET_MEMBERS_GROUP_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
