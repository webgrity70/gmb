import moment from 'moment-timezone';
import get from 'lodash/get';
import { createSelector } from 'redux-starter-kit';
import groupBy from 'lodash/groupBy';

const getChallenges = (state) => state.entities.challenges.list;

const getMembersPagination = (state) => state.pagination.challengeMembers;
const getChallengesPagination = (state) => state.pagination.challenges;
const getChallengesForInvitesPagination = (state) =>
  state.pagination.challengesForInvites;
const getChallengesDetails = (state) => state.entities.challenges.details;
const getChallengesMembers = (state) => state.entities.challenges.members;
const getChallengesConfirmations = (state) =>
  state.entities.challenges.confirmations;
const getChallengesCheckins = (state) => state.entities.challenges.checkins;
const getChallengesCalendars = (state) => state.entities.challenges.calendar;

export const getFlashChallegesByInterval = createSelector(
  [getChallenges, (state, { startDate, endDate }) => ({ startDate, endDate })],
  (challenges, { startDate, endDate }) => {
    const start = moment(startDate).startOf('day');
    const end = moment(endDate).endOf('day');
    return Object.values(challenges)
      .filter((e) => {
        if (e.type && e.type !== 'Flash') return false;
        const date = moment(e.event.date);
        const isDateInRange =
          !date.isBefore(start, 'day') && !date.isAfter(end, 'day');

        return (
          isDateInRange &&
          moment().isBefore(date.clone().add({ minutes: e.event.duration }))
        );
      })
      .sort(
        (a, b) =>
          moment(a.event.date).valueOf() - moment(b.event.date).valueOf()
      )
      .map(({ id }) => id);
  }
);

export const getGlobalFlashChallenge = createSelector(
  [getChallenges, (state, { id }) => id],
  (challenges, id) => challenges[id]
);

export const getChallengeDetails = createSelector(
  [
    getChallengesDetails,
    (state, { id, match }) => id || get(match, 'params.id'),
  ],
  (challenges, id) => challenges[id]
);

export const getChallengeConfirmations = createSelector(
  [getChallengesConfirmations, (state, { id }) => id],
  (challenges, id) => challenges[id]
);

export const getChallengeCheckins = createSelector(
  [getChallengesCheckins, (state, { id }) => id],
  (challenges, id) => challenges[id]
);

export const getIntervalDate = (state) =>
  state.pagination.flashChallenges.filters;

export const getChallengeInviteData = createSelector(
  [getChallengesDetails, (state, { computedMatch: { params } }) => params.id],
  (challenges, id) => {
    const details = challenges[id];
    if (!details) return null;
    return {
      id: Number(id),
      name: details.name,
      official: details.official,
      icon: details.icon,
      challengeManager: details.challengeManager,
      categories: details.categories,
      category: details.categories[0].name,
      specifics: details.description,
      planId: details.userPlanID,
      date: details.startDate,
      baseTemplate: details.templateID,
      joinedAt: details.challengeJoinedDate || details.joinedAt,
      templateID: details.templateID,
      checkInWindowEnd: moment(details.startDate).add(
        60 + details.duration,
        'minutes'
      ),
      participants: 1,
      featured: false,
      ...(details.events &&
        details.events.length > 0 && {
          place: details.events[0].place,
          duration: details.events[0].duration,
          milestone: details.events[0].milestone,
          milestoneOnTrack: details.events[0].milestoneOnTrack,
          milestonePoints: details.events[0].milestonePoints,
          prompts: details.events[0].prompts,
          eventID: details.events[0].id,
          templateID: details.events[0].templateID,
          habit: details.events[0].habit,
          habitID: details.events[0].habitID,
        }),
    };
  }
);

const getPlanCalendar = createSelector(
  [getChallengesCalendars, (state, { id }) => id],
  (calendars, id) => {
    const calendar = calendars[id];
    if (calendar) return Object.values(calendar);
    return [];
  }
);

function plansToCalendarList(calendar, details) {
  const plansValues = Object.values(calendar).map((event) => {
    const date = moment(event.userStartTime || event.templateStartTime);
    const start = date.clone();
    return {
      ...event,
      hidePill: true,
      challengeName: details.name,
      participants: details.participants,
      challengeID: details.id,
      challengeType: details.type || 'Flexible',
      prompts: event.prompts,
      planId: details.planID,
      eventTemplateID: event.templateID,
      challengeJoinDate: details.challengeJoinedDate,
      challengeManager: details.challengeManager,
      id: event.userEventID || event.templateID,
      location: event.location || event.templateLocation,
      milestone: event.userMilestone || event.milestone,
      specifics: event.userSpecifics || event.templateSpecifics,
      checkInWindowEnd: start
        .clone()
        .add(event.duration, 'minutes')
        .add(1, 'day'),
      className: (() => {
        switch (event.habit.category) {
          case 'Work':
            return 'c-work f-circle';
          case 'Life':
            return 'c-life f-circle';
          case 'Learn':
            return 'c-learn f-circle';
          case 'Health & Fitness':
            return 'c-health-fitness f-circle';
          default:
            return '';
        }
      })(),
      start: start.format('YYYY-MM-DD[T]HH:mm:ss'),
      date: start.clone().startOf('day').format(),
    };
  });
  const plansGroups = groupBy(plansValues, ({ date }) => date);
  return Object.keys(plansGroups)
    .map((start) => ({
      events: plansGroups[start].sort(
        (a, b) => moment(a.start) - moment(b.start)
      ),
      start,
    }))
    .sort((a, b) => moment(a.start) - moment(b.start));
}

export const getCalendarList = createSelector(
  [getPlanCalendar, getChallengeDetails],
  (calendar, details) => plansToCalendarList(calendar, details)
);

export const getMembersPaginationNextUrl = createSelector(
  [getMembersPagination],
  ({ next }) => next
);

export const getChallengesPaginationNextUrl = createSelector(
  [getChallengesPagination],
  ({ next }) => next
);

export const getChallengesForInvitesPaginationNextUrl = createSelector(
  [getChallengesForInvitesPagination],
  ({ next }) => next
);

const getChallengesPaginationOrder = createSelector(
  [getChallengesPagination],
  ({ pagination }) => pagination
);

const getChallengesForInvitesPaginationOrder = createSelector(
  [getChallengesForInvitesPagination],
  ({ pagination }) => pagination
);

export const getCurrentChallengeMembers = createSelector(
  [getChallengesMembers, (state, { id }) => id],
  (members, id) => members[id] || []
);

export const getRegularChallenges = createSelector(
  [getChallenges, getChallengesPaginationOrder],
  (challenges, pagination) =>
    pagination
      .map((id) => challenges[id])
      .filter((e) => e.type && e.type !== 'Flash')
);

export const getChallengesForInvites = createSelector(
  [
    (state) => state.session.challengesForInvites,
    getChallengesForInvitesPaginationOrder,
  ],
  (challenges, pagination) => pagination.map((id) => challenges[id])
);

export const getCalendarWindow = (state) =>
  state.session.challengeCalendarWindow;

const getFirstEvent = createSelector(
  [getCalendarWindow],
  ({ firstEvent }) => firstEvent
);

const getLastEvent = createSelector(
  [getCalendarWindow],
  ({ lastEvent }) => lastEvent
);

const getCalendar = createSelector(
  [
    getChallengesCalendars,
    (state, { id, match }) => id || get(match, 'params.id'),
  ],
  (calendars, id) => calendars[id]
);

export const getHasMorePrevious = createSelector(
  [getCalendar, getFirstEvent],
  (calendar, firstEvent) => firstEvent && !calendar[firstEvent.id]
);

export const getHasMore = createSelector(
  [getCalendar, getLastEvent],
  (calendar, lastEvent) => lastEvent && !calendar[lastEvent.id]
);
