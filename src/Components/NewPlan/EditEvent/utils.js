import isEmpty from 'lodash/isEmpty';
import moment from 'moment-timezone';
import {
  required,
  minLength,
  biggerThan,
  validateTime,
  validateFormat,
  customPromptsValidation,
  inRange,
} from '../../../utils/reduxFormValidators';
import convertMeridiem from '../../../utils/convertMeridiem';

export const initialValues = {
  habit: { description: '' },
  duration: { hours: '', minutes: '' },
  time: {
    format: 'am',
  },
  milestone: {
    active: false,
    type: 'completed',
    progress: 100,
    description: '',
  },
  customPrompts: {
    active: false,
    prompts: [''],
  },
};

export function validate(values, { dirty }) {
  if (isEmpty(values) || !dirty) return {};
  const durationError =
    biggerThan(values.duration.hours, 0) &&
    biggerThan(values.duration.minutes, 0);
  const getLimitDateError = () => {
    if (!values.limitDate) return null;
    const eventDate = values.date.clone().set({
      hours: convertMeridiem({
        hour: values.time.hours,
        format: values.time.format,
      }),
      minutes: Number(values.time.minutes),
      seconds: 0,
      milliseconds: 0,
    });
    if (eventDate.isAfter(moment(values.limitDate)))
      return "This is a consecutive challenge! You can't change the order of events.";
    return null;
  };
  return {
    location: required(values.location),
    habit: required(values.habit.habit) || required(values.habit.category),
    milestone: values.milestone.active
      ? minLength(values.milestone.description, 3)
      : null,
    time:
      required(values.time.hours) ||
      inRange(values.time.hours, 0, values.time.format ? 12 : 24) ||
      required(values.time.minutes) ||
      inRange(values.time.minutes, 0, 59) ||
      validateFormat(values.time) ||
      validateTime({
        time: values.time,
        date:
          values.type === 'multi' ? values.repeatDates.startDate : values.date,
      }) ||
      getLimitDateError(),
    duration: durationError ? 'Required' : null,
    customPrompts: customPromptsValidation(values.customPrompts),
  };
}
