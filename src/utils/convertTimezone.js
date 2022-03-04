import moment from 'moment';

export function challengeDateStringToLocalTimezone({
  date,
  restriction,
  timezone,
} = {}) {
  if (restriction !== 'Global' && timezone) {
    return moment(moment(date).tz(timezone).format('YYYY-MM-DDTHH:mm:ss'))
      .utc()
      .toISOString();
  }

  return date;
}

export function challengeLocalDateStringToTemplateTimezone({
  date,
  restriction,
  timezone,
} = {}) {
  if (restriction !== 'Global' && timezone) {
    const localUtcOffset = moment().utcOffset();
    const timezoneUtcOffset = moment.tz(timezone).utcOffset();
    const minutes = -1 * (timezoneUtcOffset - localUtcOffset);
    return moment(date).add(minutes, 'minutes').toISOString();
  }

  return date;
}
