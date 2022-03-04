import moment from 'moment';
import { Remarkable } from 'remarkable';
import { linkify } from 'remarkable/linkify';
import { getTimeFromMinutes } from '../../NewPlan/utils';
import indexesToPrompts from '../../../utils/indexesToPrompts';

const md = new Remarkable({ linkTarget: '_blank' }).use(linkify);

export function getInitialValues({ timeFormat, event }) {
  const eventDate = event.start_date || event.start || event.startDate || null;
  const date = moment(new Date(eventDate));
  const [mHours, mMinutes, mFormat] = date
    .clone()
    .format(timeFormat)
    .replace(/\s/, ':')
    .split(/:/);
  const { hours: dHours, minutes: dMinutes } = getTimeFromMinutes(
    event.duration || event.session_duration || event.sessionDuration
  );
  return {
    date,
    type: 'single',
    habit: {
      category: event.habit.category.name || event.habit.category,
      habit: event.habit.name,
      slug: event.habit.categorySlug || event.habit.category.slug,
      value: event.habit.id,
      description: md.render(event.specifics),
    },
    time: {
      minutes: mMinutes,
      hours: mHours,
      ...(mFormat && { format: mFormat }),
    },
    duration: {
      hours: dHours > 0 ? String(dHours) : undefined,
      minutes: dMinutes > 0 ? String(dMinutes) : undefined,
    },
    customPrompts: {
      active: event.prompts.length > 0,
      prompts:
        event.prompts.length > 0 ? indexesToPrompts(event.prompts) : [''],
    },
    description: md.render(event.specifics),
    location: event.location,
    milestone: {
      active: !!event.milestone,
      description: event.milestone || '',
    },
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
}

export function getSaveAsTemplateEvent(event) {
  return {
    id: event.pk || event.id,
    date: event.start_date || event.start,
    habit: event.habit.name || event.habit.habit,
    category: event.habit.category.name || event.habit.category,
    place: event.location,
    duration: event.duration || event.session_duration,
    ...(event.milestone && { milestone: event.milestone }),
    ...(event.prompts && {
      prompts: event.prompts.map((p) => (typeof p === 'object' ? p.prompt : p)),
    }),
    ...(event.specifics && { specifics: event.specifics }),
  };
}
