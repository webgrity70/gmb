import moment from 'moment-timezone';
import { required, minLength } from '../../../utils/reduxFormValidators';

export function validate(values, { dirty }) {
  if (!dirty) return {};
  return {
    events:
      Object.keys(values.events).length > 0
        ? null
        : 'You should have at least 1 event',
    date:
      required(values.date) ||
      required(values.date.startDate) ||
      required(values.date.endDate),
    goal: required(values.goal) || minLength(values.goal, 3),
    templateName: !values.createTemplate
      ? null
      : minLength(values.templateName, 3),
  };
}

export const initialValues = {
  events: {},
  timezoneRestriction: 'Global',
  timezone: moment.tz.guess(),
  createTemplate: false,
  templateName: '',
  globalTemplate: false,
  date: {
    startDate: moment(),
    endDate: moment().add(3, 'weeks').endOf('week'),
  },
};
