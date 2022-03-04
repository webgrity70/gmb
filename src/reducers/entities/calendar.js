import { createReducer } from 'redux-starter-kit';
import omit from 'lodash/omit';
import keyBy from 'lodash/keyBy';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import * as plansActions from '../../Actions/actions_plan';
import { logout } from '../../Actions/actions_user';
import * as challengesActions from '../../Actions/actions_challenges';

const md = new Remarkable({ linkTarget: '_blank' }).use(linkify);

const initialState = {};
const reducer = createReducer(initialState, {
  [plansActions.fetchCalendarList.succeeded.type]: (state, action) => ({
    ...state,
    ...keyBy(action.payload, 'id'),
  }),
  [plansActions.deleteEvent.succeeded.type]: (state, { payload: { id } }) =>
    omit(state, id),
  [plansActions.updatePlan.succeeded]: (state, { payload }) => ({
    ...omit(state, payload.eventsIds),
  }),
  [plansActions.updateEvent.succeeded.type]: (
    state,
    { payload: { fields } }
  ) => {
    if (state[fields.id]) {
      return {
        ...state,
        [fields.id]: {
          ...state[fields.id],
          start: fields.localDate || fields.date,
          location: fields.place,
          duration: fields.duration,
          ...(fields.specifics && { description: md.render(fields.specifics) }),
        },
      };
    }
    return state;
  },
  [plansActions.deletePlan.succeeded.type]: (state, { payload }) => {
    const deletableKeys = Object.keys(state).filter(
      (e) => state[e].planID === payload.id
    );
    return omit(state, deletableKeys);
  },
  [challengesActions.leaveChallenge.succeeded]: (state, { payload }) => {
    const deletableKeys = Object.keys(state).filter(
      (e) => state[e].challengeID === payload.challengeId
    );
    return omit(state, deletableKeys);
  },
  [logout.type]: () => initialState,
});

export default reducer;
