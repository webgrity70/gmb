import moment from 'moment-timezone';
import { required, minLength, url } from '../../../utils/reduxFormValidators';

export function validate(values, { dirty }) {
  if (!dirty) return {};
  const changed =
    !!values.advanced.specifics ||
    !!values.advanced.location ||
    !!values.advanced.duration ||
    values.advanced.time !== 'no';
  return {
    events:
      Object.keys(values.events).length > 0
        ? null
        : 'You should have at least 1 event',
    date:
      required(values.date) ||
      required(values.date.startDate) ||
      required(values.date.endDate),
    name: required(values.name) || minLength(values.name, 3),
    website: values.website ? url(values.website) : null,
    languages: required(values.languages),
    description:
      required(values.description) || minLength(values.description, 10),
    advanced: {
      active:
        values.advanced.active && !changed
          ? 'You must select at least one option.'
          : null,
      // activeTime: values.advanced.activeTime
      // && values.advanced.time === 'no' ? 'Required' : null,
    },
  };
}

export const initialValues = {
  name: '',
  events: {},
  intensity: 'Easy',
  description: '',
  website: '',
  createEvents: true,
  timezoneRestriction: 'User Local Timezone',
  type: false,
  intervalType: false,
  mustJoinBeforeStart: false,
  advanced: {
    active: false,
    // activeTime: false,
    specifics: false,
    location: false,
    duration: false,
    time: false, // 'no'
  },
  timezone: moment.tz.guess(),
  languages: [{ label: 'English', value: 'en' }],
  date: {
    startDate: moment(),
    endDate: moment().clone().add(4, 'weeks').endOf('week'),
  },
};
