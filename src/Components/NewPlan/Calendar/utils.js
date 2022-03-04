import moment from 'moment';
import convertMeridiem from '../../../utils/convertMeridiem';

export function getWeekInterval(deleteSettings) {
  if (!deleteSettings.date) return null;
  return `(${deleteSettings.date
    .clone()
    .startOf('week')
    .format('MMM D')} - ${deleteSettings.date
    .clone()
    .endOf('week')
    .format('MMM D')})`;
}

export function getEvents({ events, comparableDate }) {
  if (!events) return [];
  return Object.values(events).filter((event) => {
    const date = new Date(event.date);
    return comparableDate.isSame(date, 'week');
  });
}
export function getDeletableEventsKeys({
  events,
  deleteOption,
  deleteSettings,
  startDate,
  endDate,
}) {
  if (deleteOption === 'all') {
    const eventsKeys = Object.values(events)
      .filter((e) => e.habit.value === deleteSettings.habit.value)
      .map(({ habit, date, time }) => {
        const dayUnix = date
          .clone()
          .set({
            minutes: time.minutes,
            hours: convertMeridiem({ hour: time.hours, format: time.format }),
            seconds: 0,
            milliseconds: 0,
          })
          .format('X');
        return `${habit.value}/${dayUnix}`;
      });
    return eventsKeys;
  }
  const eventsKeys = getEvents({ events, comparableDate: deleteSettings.date })
    .filter((e) => {
      const date = moment(e.date).clone();
      return (
        !date.isBefore(startDate, 'day') &&
        !date.isAfter(endDate, 'day') &&
        e.habit.value === deleteSettings.habit.value
      );
    })
    .map(({ habit, date, time }) => {
      const dayUnix = date
        .clone()
        .set({
          minutes: time.minutes,
          hours: convertMeridiem({ hour: time.hours, format: time.format }),
          seconds: 0,
          milliseconds: 0,
        })
        .format('X');
      return `${habit.value}/${dayUnix}`;
    });
  return eventsKeys;
}
