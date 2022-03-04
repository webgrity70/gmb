import { createAction } from 'redux-starter-kit';
import moment from 'moment';
import omitBy from 'lodash/omitBy';
import omit from 'lodash/omit';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import { makeFetchAction } from './utils';
import PlanService from '../Services/PlanService';
import CalendarCacheService from '../Services/CalendarCacheService';
import { getGTPaginationNextUrl, getGTParams } from '../selectors/plans';
import { authenticatedPost } from '../utils/fetch';
import DashboardService from '../Services/DashboardService';

export const changeGTSearch = createAction(
  '[GLOBAL-TEMPLATE] CHANGE_GT_SEARCH'
);
export const changeGTFilter = createAction(
  '[GLOBAL-TEMPLATE] CHANGE_GT_FILTER'
);
export const resetGTPagination = createAction(
  '[GLOBAL-TEMPLATE] RESET_GT_PAGINATION'
);

export const setDraftPlan = createAction('[GLOBAL-TEMPLATE] DRAFT_PLAN');
export const fetchGlobalTemplatesStarted = createAction(
  '[GLOBAL-TEMPLATE] FETCH_GT_STARTED'
);
export const fetchGlobalTemplatesSucceeded = createAction(
  '[GLOBAL-TEMPLATE] FETCH_GT_SUCCEEDED'
);
export const fetchGlobalTemplatesFailed = createAction(
  '[GLOBAL-TEMPLATE] FETCH_GT_FAILED'
);

export const createEvent = makeFetchAction({
  actionGroup: 'EVENT',
  action: 'CREATE_EVENT',
  fetchData: PlanService.createEvent,
  onSucceedPayload: (args, res) => ({
    ...res,
    skipToast: args[1],
    skipAction: args[2],
  }),
});

export const createPlan = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'CREATE_PLAN',
  fetchData: PlanService.createPlan,
  onSucceedPayload: (args, res) => ({ ...res, skipToast: args[1] }),
});

export const fetchPlansTemplates = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'FETCH_PLANS_TEMPLATES',
  fetchData: PlanService.getPlansTemplates,
});

export const fetchEventsTemplates = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'FETCH_EVENTS_TEMPLATES',
  fetchData: PlanService.getEventsTemplates,
});

export const deleteTemplate = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'DELETE_TEMPLATE',
  fetchData: PlanService.deleteTemplate,
  onSucceedPayload: (args) => args[0],
});

export const updateTemplate = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'UPDATE_TEMPLATE',
  fetchData: PlanService.updateTemplate,
  onSucceedPayload: (args) => args[0],
});

export const fetchCalendarList = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'FETCH_PLANS',
  fetchData: PlanService.getPlans,
  onSucceedHandler: ([actionStart, actionEnd], data) => {
    const start = moment()
      .startOf('month')
      .startOf('week')
      .format('YYYY-MM-DD');
    const end = moment().endOf('month').endOf('week').format('YYYY-MM-DD');

    if (actionStart === start && actionEnd === end) {
      CalendarCacheService.savePlans(data);
    }
  },
});

export const fetchPlan = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'FETCH_PLAN',
  fetchData: PlanService.getPlan,
});

export const deletePlan = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'DELETE_PLAN',
  fetchData: PlanService.deletePlan,
  onSucceedPayload: (args, res) => ({
    id: args[0],
    skipToast: args[1],
    ...res,
  }),
  onSucceedHandler: () => {
    CalendarCacheService.deletePlans();
  },
});

export const fetchTemplateDetails = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'FETCH_TEMPLATE_DETAILS',
  fetchData: PlanService.getTemplate,
});

export const fetchEventDetails = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'FETCH_EVENT_DETAILS',
  fetchData: PlanService.getEvent,
});

export const trackMilestone = makeFetchAction({
  actionGroup: 'EVENT',
  action: 'TRACK_EVENT_MILESTONE',
  fetchData: DashboardService.trackMilestone,
});

export const deleteEvent = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'DELETE_EVENT',
  fetchData: PlanService.clearEvent,
  onSucceedPayload: (args, res) => ({
    id: args[0],
    skipToast: args[1],
    ...res,
  }),
  onSucceedHandler: () => {
    CalendarCacheService.deletePlans();
  },
});

export const updateEvent = makeFetchAction({
  actionGroup: 'EVENT',
  action: 'UPDATE_EVENT',
  fetchData: (data) => PlanService.updateEvent(omit(data, 'localDate')),
  onSucceedPayload: (args, res) => ({
    skipAction: args[1],
    fields: args[0],
    ...res,
  }),
  onSucceedHandler: () => {
    CalendarCacheService.deletePlans();
  },
});

export const updatePlan = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'UPDATE_PLAN',
  fetchData: PlanService.updatePlan,
  onSucceedPayload: (args, res) => ({ ...args[0], ...res }),
  onSucceedHandler: () => {
    CalendarCacheService.deletePlans();
  },
});

export const fetchPlanWindow = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'FETCH_PLAN_WINDOw',
  fetchData: PlanService.getPlanWindow,
});

export function fetchGlobalTemplates() {
  return async (dispatch, getState) => {
    const state = getState();
    const params = getGTParams(state);
    dispatch(fetchGlobalTemplatesStarted());
    const nextUrl = getGTPaginationNextUrl(state);
    try {
      let data;
      const body = {
        ...(!isEmpty(params.input) && { input: params.input }),
        ...(!isEmpty(params.filters) && {
          filters: omitBy(params.filters, isNil),
        }),
      };
      if (!nextUrl) {
        data = await PlanService.getGlobalTemplates(body);
      } else {
        data = await authenticatedPost(nextUrl, body);
      }
      dispatch(
        fetchGlobalTemplatesSucceeded({
          ...data,
          results: data.results.filter((e) => !e.challenge),
        })
      );
    } catch (e) {
      dispatch(fetchGlobalTemplatesFailed({ error: e }));
    }
  };
}

export const getPlansForDashboard = makeFetchAction({
  actionGroup: 'PLAN',
  action: 'GET_FOR_DASHBOARD',
  fetchData: DashboardService.getPlansForDashboardV2,
});
