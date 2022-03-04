import moment from 'moment';

export default (timezoneName, timezoneOffset) =>
  `${moment.tz(timezoneName).zoneAbbr()} (${timezoneOffset} hrs. from you)`;
