import { createReducer } from 'redux-starter-kit';
import moment from 'moment';
import * as challengeActions from '../../Actions/actions_challenges';

const initialState = {
  filters: { startDate: moment(), endDate: moment().add(7, 'days') },
};

const reducer = createReducer(initialState, {
  [challengeActions.changeIntervalDate]: (state, { payload }) => ({
    filters: payload,
  }),
});

export default reducer;
