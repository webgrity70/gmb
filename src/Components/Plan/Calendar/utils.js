/* eslint-disable no-plusplus */
import { VIEWS } from '../Toolbar/utils';

function getStartDay({ currentDate, view }) {
  const date = currentDate.clone();
  switch (view) {
    case VIEWS.month:
      return date.locale('en').startOf('month').startOf('week');
    case VIEWS.week:
      return date.locale('en').startOf('week');
    default:
      return currentDate;
  }
}
function getEndDay({ currentDate, view }) {
  const date = currentDate.clone();
  switch (view) {
    case VIEWS.month:
      return date.endOf('month').endOf('week');
    case VIEWS.week:
      return date.endOf('week');
    default:
      return date;
  }
}
export const fillDays = ({ currentDate, view }) => {
  const calendar = [];
  const startDay = getStartDay({ currentDate, view });
  const endDay = getEndDay({ currentDate, view });
  const date = startDay.clone().subtract(1, 'day');
  while (date.isBefore(endDay, 'day')) {
    calendar.push({
      days: Array(7)
        .fill(0)
        .map(() => date.add(1, 'day').clone()),
    });
  }
  return calendar;
};

export const fillNewPlanDays = ({ startDate, endDate }) => {
  const calendar = [];
  const date = startDate
    .clone()
    .locale('en')
    .startOf('week')
    .subtract(1, 'day');
  const end = endDate.clone().locale('en').endOf('week');
  while (date.isBefore(end, 'day')) {
    calendar.push({
      days: Array(7)
        .fill(0)
        .map(() => date.add(1, 'day').clone()),
    });
  }
  return calendar;
};

export const getLabel = ({ currentDate, view }) => {
  const date = currentDate.clone();
  switch (view) {
    case VIEWS.month: {
      return date.locale('en').format('MMMM YYYY');
    }
    case VIEWS.week: {
      const startOfWeek = date.clone().startOf('week');
      const endOfWeek = date.clone().endOf('week');
      if (startOfWeek.format('MMMM') !== endOfWeek.format('MMMM')) {
        return `${startOfWeek.locale('en').format('MMMM')} ${startOfWeek
          .locale('en')
          .format('D')} - ${endOfWeek
          .locale('en')
          .format('MMMM')} ${endOfWeek.locale('en').format('D')}`;
      }
      return `${startOfWeek.locale('en').format('MMMM')} ${startOfWeek
        .locale('en')
        .format('D')} - ${endOfWeek.locale('en').format('D')}`;
    }
    default:
      return '';
  }
};

export const getNewDate = ({ action, currentDate, view }) => {
  const date = currentDate.clone();
  switch (view) {
    case VIEWS.month: {
      switch (action) {
        case 'NEXT':
          return date.add(1, 'month');
        case 'PREV':
          return date.subtract(1, 'month');
        default:
          return date;
      }
    }
    case VIEWS.week: {
      switch (action) {
        case 'NEXT':
          return date.add(1, 'week');
        case 'PREV':
          return date.subtract(1, 'week');
        default:
          return date;
      }
    }
    default:
      return date;
  }
};
