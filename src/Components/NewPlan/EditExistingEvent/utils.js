import isEmpty from 'lodash/isEmpty';
import {
  required,
  minLength,
  biggerThan,
  validateTime,
  customPromptsValidation,
  validateFormat,
  inRange,
  maxLength,
} from '../../../utils/reduxFormValidators';

export function validate(values) {
  if (isEmpty(values)) return {};
  const durationError =
    biggerThan(values.duration.hours, 0) &&
    biggerThan(values.duration.minutes, 0);
  const challengeError =
    required(values.challenge.name) || maxLength(values.challenge.name, 90);
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
      }),
    duration: durationError ? 'Required' : null,
    challenge: values.challenge.active ? challengeError : null,
    customPrompts: customPromptsValidation(values.customPrompts),
  };
}
