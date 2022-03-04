import isEmpty from 'lodash/isEmpty';
import {
  minLength,
  required,
  biggerThan,
  validateFormat,
  inRange,
} from '../../../utils/reduxFormValidators';

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
  const shouldValidateDuration =
    values.duration.hours || values.duration.minutes;
  const durationError =
    biggerThan(values.duration.hours, 0) &&
    biggerThan(values.duration.minutes, 0);
  const shouldValidateTime = values.time.hours || values.time.minutes;
  const timeValidation =
    required(values.time.hours) ||
    inRange(values.time.hours, 0, values.time.format ? 12 : 24) ||
    required(values.time.minutes) ||
    inRange(values.time.minutes, 0, 59) ||
    validateFormat(values.time);
  return {
    milestone: values.milestone.active
      ? minLength(values.milestone.description, 3)
      : null,
    time: shouldValidateTime ? timeValidation : null,
    duration: shouldValidateDuration && durationError ? 'Required' : null,
  };
}
