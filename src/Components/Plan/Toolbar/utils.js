import moment from 'moment';

export const VIEWS = {
  agenda: 'agenda',
  week: 'week',
  month: 'month',
};

export function getNewPeriod({ view, date }) {
  switch (view) {
    case VIEWS.month:
      return {
        start: moment(date)
          .locale('en')
          .startOf('month')
          .startOf('week')
          .format('YYYY-MM-DD'),
        end: moment(date)
          .locale('en')
          .endOf('month')
          .endOf('week')
          .format('YYYY-MM-DD'),
      };
    case VIEWS.week:
      return {
        start: moment(date).locale('en').startOf('week').format('YYYY-MM-DD'),
        end: moment(date).locale('en').endOf('week').format('YYYY-MM-DD'),
      };
    default:
      return {
        start: moment().subtract(1, 'month').format('YYYY-MM-DD'),
        end: moment().add(1, 'month').format('YYYY-MM-DD'),
      };
  }
}
