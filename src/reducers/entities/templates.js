import { createReducer } from 'redux-starter-kit';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import * as plansActions from '../../Actions/actions_plan';

const initialState = { plans: {}, events: {} };
const reducer = createReducer(initialState, {
  [plansActions.fetchPlansTemplates.succeeded.type]: (state, action) => ({
    ...state,
    plans: keyBy(action.payload, 'id'),
  }),
  [plansActions.fetchEventsTemplates.succeeded.type]: (state, action) => ({
    ...state,
    events: keyBy(action.payload, 'id'),
  }),
  [plansActions.deleteTemplate.succeeded.type]: (state, { payload }) => ({
    events: omit(state.events, payload),
    plans: omit(state.plans, payload),
  }),
  [plansActions.updateTemplate.succeeded.type]: (
    state,
    { payload: { id, name } }
  ) => ({
    events: {
      ...state.events,
      ...(state.events[id] && {
        [id]: {
          ...state.events[id],
          name,
        },
      }),
    },
    plans: {
      ...state.plans,
      ...(state.plans[id] && {
        [id]: {
          ...state.plans[id],
          name,
        },
      }),
    },
  }),
});

export default reducer;
