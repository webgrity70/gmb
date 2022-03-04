import moment from 'moment';
import { parseMinutesToDuration } from '../../NewPlan/utils';

export const getEventInitialValues = ({ values }) => ({
  createTemplate: false,
  habit: {
    habit: values.habit.name,
    text: values.habit.name,
    category: values.habit.category.name,
    value: values.habit.id,
    slug: values.habit.category.slug,
  },
  openSpecifics: !!values.specifics,
  specifics: values.specifics,
  sessionDuration: parseMinutesToDuration(values.sessionDuration),
  place: values.location,
  date: moment(values.startDate),
  time: moment(values.startDate).format('HH:mm'),
});
