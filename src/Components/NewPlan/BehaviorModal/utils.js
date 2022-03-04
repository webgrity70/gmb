import isEmpty from 'lodash/isEmpty';
import moment from 'moment-timezone';

import {
  required,
  minLength,
  biggerThan,
  inRange,
  maxLength,
  validateTime,
  validateFormat,
  customPromptsValidation,
} from '../../../utils/reduxFormValidators';
import convertMeridiem from '../../../utils/convertMeridiem';
import { parseDurationToMinutes } from '../utils';
import indexesToPrompts from '../../../utils/indexesToPrompts';

const toMarkdown = require('to-markdown');

export function validate(values, { open }) {
  if (isEmpty(values) || !open) return {};
  const durationError =
    biggerThan(values.duration.hours, 0) &&
    biggerThan(values.duration.minutes, 0);
  const challengeError =
    required(values.challenge.name) || maxLength(values.challenge.name, 90);
  return {
    type: required(values.type),
    habit: required(values.habit.habit) || required(values.habit.category),
    repeat: values.type === 'multi' ? required(values.repeat) : null,
    date: values.type === 'single' ? required(values.date) : null,
    location: required(values.location),
    customPrompts:
      required(values.customPrompts) ||
      customPromptsValidation(values.customPrompts),
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
    repeatDates:
      values.type === 'multi'
        ? required(values.repeatDates.startDate) ||
          required(values.repeatDates.endDate)
        : null,
  };
}

export const initialValues = {
  type: 'multi',
  habit: {},
  customPrompts: {
    active: false,
    prompts: [''],
  },
  duration: { hours: '', minutes: '' },
  time: {
    format: 'am',
  },
  repeat: null,
  repeatDates: { startDate: null, endDate: null },
  milestone: {
    active: false,
    description: '',
  },
  customDays: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    0: false,
  },
  goal: '',
  challenge: {
    active: false,
    name: '',
    address: {
      active: false,
      location: '',
      placeId: null,
    },
  },
};

export const customDaysOptions = [
  { key: 'custom-day-1', label: 'Mon', name: 'customDays.1' },
  { key: 'custom-day-2', label: 'Tue', name: 'customDays.2' },
  { key: 'custom-day-3', label: 'Wed', name: 'customDays.3' },
  { key: 'custom-day-4', label: 'Thu', name: 'customDays.4' },
  { key: 'custom-day-5', label: 'Fri', name: 'customDays.5' },
  { key: 'custom-day-6', label: 'Sat', name: 'customDays.6' },
  { key: 'custom-day-7', label: 'Sun', name: 'customDays.0' },
];

export const options = [
  { value: 'multi', label: 'Multi-day' },
  { value: 'single', label: 'Single' },
];
export const repeatOptions = [
  { key: 'repeat-1', text: 'Everyday', value: 1 },
  { key: 'repeat-2', text: 'Every 2 days', value: 2 },
  { key: 'repeat-3', text: 'Every 3 days', value: 3 },
  { key: 'repeat-4', text: 'Every 4 days', value: 4 },
  { key: 'repeat-5', text: 'Every 5 days', value: 5 },
  { key: 'repeat-6', text: 'Every 6 days', value: 6 },
  { key: 'repeat-custom', text: 'Custom', value: 0 },
];

export const formName = 'new-behavior';

export const getSinglePlanValues = ({
  date,
  time,
  habit,
  location,
  duration,
  milestone,
  challenge,
  baseTemplate,
  templateEvent,
  customPrompts,
}) => {
  const fullDate = moment(new Date(date)).set({
    hours: convertMeridiem({ hour: time.hours, format: time.format }),
    minutes: time.minutes,
  });
  const name = `${habit.habit} for ${
    duration.hours > 0 ? `${duration.hours}h ` : ''
  }${duration.minutes > 0 ? `${duration.minutes}m` : ''}`;
  return {
    name: challenge.active ? challenge.name : name,
    startDate: moment.utc(fullDate).format('YYYY-MM-DD'),
    weeks: 1,
    timezoneRestriction: 'Global',
    timezone: moment.tz.guess(),
    createTemplate: challenge.active && !baseTemplate,
    globalTemplate: challenge.active,
    challenge: {
      ...challenge,
      description: name,
    },
    events: [
      {
        date: moment.utc(fullDate).format(),
        category: habit.category,
        habit: habit.habit,
        place: location,
        duration: parseDurationToMinutes(
          `${duration.hours}h ${duration.minutes}m`
        ),
        ...(milestone.active && {
          milestone: milestone.description,
        }),
        ...(templateEvent && { templateEvent }),
        ...(habit.description && { specifics: toMarkdown(habit.description) }),
        ...(customPrompts.active && {
          prompts: indexesToPrompts(customPrompts.prompts),
        }),
      },
    ],
    ...(baseTemplate && { baseTemplate }),
    ...(challenge.active && {
      templateName: challenge.name,
    }),
  };
};
