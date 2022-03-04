/* eslint-disable no-underscore-dangle */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-else-return */
import * as Yup from 'yup';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import omit from 'lodash/omit';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';
import moment from 'moment-timezone';
import showdown from 'showdown';
import convertMeridiem from '../../utils/convertMeridiem';
import indexesToPrompts from '../../utils/indexesToPrompts';

const durationRegex = /^((([0-1]?[0-9]h|[2][0-3]h)?\s([0-5]?[0-9]m))|([0-5]?[0-9]m)|([0-1]?[0-9]h|[2][0-4]h))$/;
const timeRegex = /^((?!Invalid Date).)*$/;

const getInitialTime = () => '';

export const parseDurationToMinutes = (val) =>
  val.split(' ').reduce((prev, current) => {
    const value = Number(current.slice(0, current.length - 1)) || 0;
    const unit = current.substr(current.length - 1);
    if (unit === 'h') return prev + value * 60;
    return prev + value;
  }, 0);

export const getTimeFromMinutes = (num) => {
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return {
    hours: rhours,
    minutes: rminutes,
  };
};
export const parseMinutesToDuration = (num) => {
  if (!num) return '';
  const { hours, minutes } = getTimeFromMinutes(num);
  if (hours > 0 && minutes <= 0) return `${hours}h`;
  else if (minutes > 0 && hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

export const parseMinutesToTime = (num) => {
  if (!num) return '';
  const { hours, minutes } = getTimeFromMinutes(num);
  const hourPre = hours === 1 ? 'hour' : 'hours';
  const minPre = minutes === 1 ? 'minute' : 'minutes';
  if (hours > 0 && minutes <= 0) return `${hours} ${hourPre}`;
  else if (minutes > 0 && hours <= 0) return `${minutes} ${minPre}`;
  return `${hours} ${hourPre} ${minutes} ${minPre}`;
};

export const parseMinutesToTimeShort = (num) => {
  if (!num) return '';
  const { hours, minutes } = getTimeFromMinutes(num);
  if (hours > 0 && minutes <= 0) return `${hours}h`;
  else if (minutes > 0 && hours <= 0) return `${minutes}min`;
  return `${hours}h ${minutes}min`;
};

export const getSlug = (name) => name.replace(' & ', '-').toLocaleLowerCase();

export const EventValidationSchema = Yup.object().shape({
  habit: Yup.object().shape({
    habit: Yup.string().trim().required('Required'),
    category: Yup.string().trim().required('Required'),
  }),
  createTemplate: Yup.bool().required('Required'),
  date: Yup.object().required('Required'),
  place: Yup.string().required('Required'),
  time: Yup.string()
    .matches(timeRegex, 'Format 6:00am, 6:00pm, 18:00')
    .required('Required'),
  sessionDuration: Yup.string()
    .matches(durationRegex, 'Format ie: 1h 30m')
    .required('Required'),
  templateName: Yup.string().when('createTemplate', {
    is: true,
    then: Yup.string().trim().required(),
  }),
});

const validateWeek = (values) => {
  const havePlaceError = !Yup.string()
    .trim()
    .min(1)
    .required()
    .isValidSync(values.place);
  const haveTimeError = !Yup.string()
    .matches(timeRegex)
    .required()
    .isValidSync(values.time);
  const havesDurationError = !Yup.string()
    .matches(durationRegex)
    .required()
    .isValidSync(values.sessionDuration);
  const haveHabitError = !Yup.object()
    .shape({
      habit: Yup.string().trim().min(1).required(),
      category: Yup.string().trim().min(1).required(),
    })
    .isValidSync(values.habit);
  const validation = {
    ...(havePlaceError && { place: 'Required' }),
    ...(haveTimeError && { time: 'Required' }),
    ...(havesDurationError && { sessionDuration: 'Format ie: 1h 30m' }),
    ...(haveHabitError && { habit: 'Required' }),
  };
  return validation;
};
const validateRepeatValues = (values) => {
  const errors = {};
  const duration = !!values.sessionDuration;
  const durationError = !Yup.string()
    .matches(durationRegex)
    .required()
    .isValidSync(values.sessionDuration);
  if (duration && durationError) {
    errors.repeat = { sessionDuration: 'Format ie: 1h 30m' };
  }
  return errors;
};
export const planValidation = (values) => {
  const errors = {};
  const weeks = Object.keys(values).filter((e) => /week/.test(e));
  const weeksValidation = reduce(
    weeks,
    (prevWeek, week) => {
      const repeatErrors = validateRepeatValues(values[week].repeatValues);
      const daysWeek = reduce(
        values[week].days,
        (prev, current, day) => {
          if (current.checked) {
            const validation = validateWeek(current);
            if (!isEmpty(validation)) return { ...prev, [day]: validation };
            return prev;
          }
          return prev;
        },
        {}
      );
      if (!isEmpty(daysWeek)) {
        return {
          ...prevWeek,
          [week]: { ...daysWeek, ...repeatErrors },
        };
      }
      if (!isEmpty(repeatErrors)) {
        return { ...prevWeek, [week]: repeatErrors };
      }
      return prevWeek;
    },
    {}
  );
  const haveDateError = !Yup.object().required().isValidSync(values.date);
  const haveGoalError = !Yup.string()
    .trim()
    .required()
    .isValidSync(values.goal);
  const haveTemplateNameError =
    values.createTemplate &&
    !Yup.string().trim().required().isValidSync(values.templateName);
  if (haveDateError) errors.date = 'Required';
  if (haveGoalError) errors.goal = 'Required';
  if (haveTemplateNameError) errors.templateName = 'Required';
  return {
    ...errors,
    ...weeksValidation,
  };
};
export const getInitial = () => ({
  habit: {},
  specifics: '',
  place: '',
  time: getInitialTime(),
  sessionDuration: '',
  checked: false,
});

export const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const transformDay = (day) => {
  switch (day) {
    case 'monday':
      return 1;
    case 'tuesday':
      return 2;
    case 'wednesday':
      return 3;
    case 'thursday':
      return 4;
    case 'friday':
      return 5;
    case 'saturday':
      return 6;
    case 'sunday':
      return 7;
    default:
      return 1;
  }
};
export const getWeekInitialValues = () => {
  /* const repeatable = Object.keys(initialValues.repeat).filter(key => initialValues.repeat[key]);
  const parentValues = pick(initialValues, repeatable);
  const values = { ...getInitial(), ...parentValues }; */
  const values = getInitial();
  return {
    days: {
      monday: [values],
      tuesday: [values],
      wednesday: [values],
      thursday: [values],
      friday: [values],
      saturday: [values],
      sunday: [values],
    },
  };
};

export const getDateFromDay = ({ dayINeed, nWeek, time, startPlan }) => {
  const [hour, minute] = time.split(':').map((e) => Number(e));
  const baseDate = moment(startPlan).clone().set({ hour, minute });
  const requestedDate = baseDate.clone().isoWeekday(dayINeed);
  if (nWeek >= 1) {
    return requestedDate.add(nWeek, 'weeks');
  }
  return requestedDate;
};

const intervalWeek = (date) =>
  `${date.clone().startOf('week').format('MMM. Do')} - ${date
    .clone()
    .sendOf('week')
    .format('MMM. Do')}`;

export const getWeekLabel = ({ nWeek, startPlan }) => {
  const baseDate = moment(startPlan).add(nWeek, 'weeks');
  return intervalWeek(baseDate);
};

export const getIsBeforeToday = ({ day, startPlan }) => {
  const dayINeed = transformDay(day);
  const baseDate = moment(startPlan);
  const requestedDate = baseDate.clone().isoWeekday(dayINeed);
  return requestedDate.isBefore(moment(), 'day');
};

export const getHabit = (event) => {
  if (typeof event.habit === 'string') {
    return {
      habit: event.habit,
      text: event.habit,
      value: event.habitID || event.habit,
      category: event.category,
      slug: getSlug(event.category),
    };
  }
  return {
    habit: event.habit.name,
    text: event.habit.name,
    value: event.habit.id,
    category: event.habit.category.name,
    slug: event.habit.category.slug,
  };
};

export const getWeeks = ({ initialValues }) => {
  const groupsOfWeeks = initialValues.events.reduce((prev, event) => {
    const date = event.startDate || event.date;
    const momentDate = moment(date);
    const yearWeek = `${moment(date).weekYear()}-${moment(date).week()}`;
    const week = prev[yearWeek] || getWeekInitialValues();
    const dayName = momentDate.clone().format('dddd').toLowerCase();
    const time = momentDate.clone().format('HH:mm');
    week.days[dayName] = [
      ...week.days[dayName],
      {
        time,
        checked: true,
        sessionDuration: parseMinutesToDuration(
          event.duration || event.sessionDuration
        ),
        habit: getHabit(event),
        place: event.place || event.location,
        specifics: event.specifics,
        openSpecifics: !!event.specifics,
      },
    ];
    return {
      ...prev,
      [yearWeek]: week,
    };
  }, {});
  const weeks = Object.keys(groupsOfWeeks).reduce(
    (prev, current, index) => ({
      ...prev,
      [`week_${index + 1}`]: groupsOfWeeks[current],
    }),
    {}
  );
  return weeks;
};

export const momentDate = (date) => moment(date);

export function getObjectDiff(obj1, obj2) {
  const diff = Object.keys(obj1).reduce((result, key) => {
    if (!obj2.hasOwnProperty(key)) {
      result.push(key);
    } else if (isEqual(obj1[key], obj2[key])) {
      const resultKeyIndex = result.indexOf(key);
      result.splice(resultKeyIndex, 1);
    }
    return result;
  }, Object.keys(obj2));
  return diff;
}

export const getTotalPoints = (event) => {
  const checkIn = event.check_in_points || event.checkInPoints || 0;
  const intention = event.intention_points || event.intentionPoints || 0;
  const milestone = event.milestonePoints || 0;
  return checkIn + intention + milestone;
};

const mapDays = (week) =>
  map(week, (dayInfo, day) => ({
    ...dayInfo,
    day: transformDay(day),
  }));

export const sortDays = ({ values, startingDay }) => {
  const daysArr =
    startingDay === 0 ? ['sunday', ...days.slice(0, days.length - 1)] : days;
  return values.sort((a, b) => daysArr.indexOf(a) > daysArr.indexOf(b));
};

export function getNextInstanceDay(dayINeed) {
  const today = moment().isoWeekday();
  if (today < dayINeed) {
    return moment().isoWeekday(dayINeed);
  }
  return moment().add(1, 'weeks').isoWeekday(dayINeed);
}

export function getWeeksKeys(weeksGroups) {
  const weeksDates = Object.keys(weeksGroups).map((e) => {
    const [year, week] = e.split('-').map((x) => Number(x));
    return { year, week };
  });
  const weeksKeys = sortBy(weeksDates, ['year', 'week']).map(
    ({ year, week }) => `${year}-${week}`
  );
  return weeksKeys;
}

export function getGroupsOfWeeks(events, startDate, endDate) {
  return Object.values(events)
    .filter((e) => {
      if (!startDate || !endDate) return true;
      const date = moment(e.date);
      const start = startDate.clone().set({ hours: 0, minutes: 0 });
      const end = endDate.clone().set({ hours: 23, minutes: 59 });
      return !date.isAfter(end) && !date.isBefore(start);
    })
    .reduce((prev, event) => {
      const date = moment(event.date);
      const yearWeek = `${date.clone().weekYear()}-${date.clone().week()}`;
      const week = prev[yearWeek] || {};
      const dayName = date.clone().format('dddd').toLowerCase();
      const dayUnix = date
        .clone()
        .set({
          minutes: Number(event.time.minutes),
          hours: convertMeridiem({
            hour: Number(event.time.hours),
            format: event.time.format,
          }),
          seconds: 0,
          milliseconds: 0,
        })
        .format('X');
      if (week[dayName] && week[dayName].length > 0) {
        week[dayName] = [...week[dayName], `${event.habit.value}/${dayUnix}`];
      } else {
        week[dayName] = [`${event.habit.value}/${dayUnix}`];
      }

      return {
        ...prev,
        [yearWeek]: week,
      };
    }, {});
}
export function convertEventsToWeeksForm({ events, startDate, timezone }) {
  let converter = new showdown.Converter();
  const tempEvents = events.reduce((prev, event) => {
    const date = timezone
      ? moment(event.date).tz(timezone)
      : moment(event.date);
    const habit = getHabit(event);
    const [timeHours, timeMinutes, format] = date
      .clone()
      .format('hh:mm:A')
      .split(':');
    const { hours: dHours, minutes: dMinutes } = getTimeFromMinutes(
      event.duration
    );
    const dayUnix = date
      .clone()
      .set({
        minutes: Number(timeMinutes),
        hours: convertMeridiem({ hour: timeHours, format }),
        seconds: 0,
        milliseconds: 0,
      })
      .format('X');
    return {
      ...prev,
      [`${habit.value}/${dayUnix}`]: {
        location: event.place,
        date,
        duration: {
          hours: dHours ? String(dHours) : undefined,
          minutes: dMinutes ? String(dMinutes) : undefined,
        },
        time: {
          hours: timeHours,
          minutes: timeMinutes,
          format: format.toLowerCase(),
        },
        milestone: {
          active: !!event.milestone,
          type: 'completed',
          progress: 100,
          description: event.milestone || '',
        },
        customPrompts: {
          active: event.prompts.length > 0,
          prompts:
            event.prompts.length > 0 ? indexesToPrompts(event.prompts) : [''],
        },
        habit: {
          ...habit,
          description: converter.makeHtml(event.specifics),
        },
      },
    };
  }, {});

  const groupsOfWeeks = getGroupsOfWeeks(tempEvents);
  const weeksKeys = getWeeksKeys(groupsOfWeeks);
  const weeks = weeksKeys.reduce((prev, weekKey, index) => {
    const startWeek = startDate.clone().startOf('week').add(index, 'week');
    return {
      ...prev,
      ...Object.keys(groupsOfWeeks[weekKey]).reduce((prevDay, day) => {
        let returnVar = {
          ...prevDay,
        };
        groupsOfWeeks[weekKey][day].map((oldKey) => {
          const isoWeekday = transformDay(day);
          const [habitValue] = oldKey.split('/');
          const { time } = tempEvents[oldKey];
          const newDate = (() => {
            const date = startWeek
              .clone()
              .isoWeekday(isoWeekday)
              .set({
                minutes: Number(time.minutes),
                hours: convertMeridiem({
                  hour: time.hours,
                  format: time.format,
                }),
                seconds: 0,
                milliseconds: 0,
              });
            return date;
          })();
          const dateTime = newDate.clone().set({
            minutes: time.minutes,
            hours: convertMeridiem({ hour: time.hours, format: time.format }),
            seconds: 0,
            milliseconds: 0,
          });
          if (dateTime.clone().isBefore(moment())) return prevDay;
          const key = `${habitValue}/${dateTime.format('X')}`;
          returnVar = {
            ...returnVar,
            [key]: { ...tempEvents[oldKey], date: newDate },
          };
        });
        return returnVar;
      }, {}),
    };
  }, {});
  return weeks;
}
