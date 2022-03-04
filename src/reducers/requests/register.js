/* eslint-disable implicit-arrow-linebreak */
import { createReducer } from 'redux-starter-kit';
import {
  REQUESTING_REGISTER,
  REGISTER_COMPLETED,
  REGISTER_ERROR,
} from '../../constants';

const initialState = {
  loading: false,
};
const reducer = createReducer(initialState, {
  [REQUESTING_REGISTER]: () => ({ loading: true }),
  [REGISTER_COMPLETED]: () => ({ loading: false }),
  [REGISTER_ERROR]: () => ({ loading: false }),
});

export default reducer;
