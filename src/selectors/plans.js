import { createSelector } from 'redux-starter-kit';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import { getUserCategories } from './profile';

const getGTPagination = (state) => state.pagination.globalTemplates;
const getTemplatesDetails = (state) => state.entities.templatesDetails;
const getIdFromProps = (state, props) => props.id;

const getPlanRequestStatus = ({ requests: { calendar } }) => calendar;

const getTemplates = (state) => state.entities.templates;
const getEvents = (state) => state.entities.events;
const getAllPlans = (state) => state.entities.plans;

const getGlobals = (state) => state.entities.globalTemplates;

export const getParamsId = (_, props) => props.match.params.id;

export function plansToCalendarList(calendar) {
  const plansValues = Object.values(calendar).map((plan) => ({
    ...plan,
    date: moment(plan.start).startOf('day').format(),
  }));
  const plansGroups = groupBy(plansValues, ({ date }) => date);
  return Object.keys(plansGroups)
    .map((date) => ({
      events: plansGroups[date].sort(
        (a, b) => moment(a.start) - moment(b.start)
      ),
      start: date,
    }))
    .sort((a, b) => moment(a.start) - moment(b.start));
}

export const getPlansTemplates = createSelector([getTemplates], ({ plans }) =>
  Object.values(plans)
);

export const getEventsTemplates = createSelector([getTemplates], ({ events }) =>
  Object.values(events)
);

const getCalendar = (state) => state.entities.calendar;

export const getCalendarList = createSelector([getCalendar], (calendar) =>
  plansToCalendarList(calendar)
);

const getCategories = (state) => state.entities.categories;

export const getHabitsByUserCats = createSelector(
  [getUserCategories, getCategories],
  (userCategories, categories) => {
    if (isEmpty(categories) || isEmpty(userCategories)) return [];
    const activeUserCategories = userCategories.filter((cat) => cat.active);
    return activeUserCategories.map(({ id }) => categories[id]);
  }
);

export const getEvent = createSelector(
  [getEvents, getParamsId],
  (events, id) => events[id]
);

export const getPlan = createSelector(
  [getAllPlans, getParamsId],
  (plans, id) => plans[id]
);

export const getPlanLoading = createSelector(
  [getPlanRequestStatus],
  ({ loading }) => loading
);

export const getPlanWindow = (state) => state.session.planWindow;

const getFirstEvent = createSelector(
  [getPlanWindow],
  ({ firstEvent }) => firstEvent
);

const getLastEvent = createSelector(
  [getPlanWindow],
  ({ lastEvent }) => lastEvent
);

export const getHasMorePrevious = createSelector(
  [getCalendar, getFirstEvent],
  (calendar, firstEvent) => firstEvent && !calendar[firstEvent.id]
);

export const getHasMore = createSelector(
  [getCalendar, getLastEvent],
  (calendar, lastEvent) => lastEvent && !calendar[lastEvent.id]
);

export const getGlobalTemplates = createSelector(
  [getGTPagination],
  ({ pagination }) => pagination
);

export const getGlobalTemplate = createSelector(
  [getGlobals, getIdFromProps],
  (templates, id) => templates[id]
);

export const getAllCategories = createSelector([getCategories], (categories) =>
  Object.values(categories)
);

export const getGTPaginationFilters = createSelector(
  [getGTPagination],
  ({ filters }) => filters
);

export const getGTPaginationInput = createSelector(
  [getGTPagination],
  ({ input }) => input
);

export const getGTPaginationNextUrl = createSelector(
  [getGTPagination],
  ({ next }) => next
);

export const getGTParams = createSelector(
  [getGTPaginationInput, getGTPaginationFilters],
  (input, filters) => ({ input, filters })
);

export const getTemplateDetails = createSelector(
  [getTemplatesDetails, getIdFromProps],
  (templates, id) => templates[id]
);

export const getHasUpcomingEvents = createSelector(
  [getCalendarList],
  (calendar) => !!calendar.find((e) => moment(e.start).isAfter(moment()))
);
