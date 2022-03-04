/* eslint-disable no-prototype-builtins */
/* eslint-disable no-else-return */
import * as Yup from 'yup';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import omit from 'lodash/omit';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import reduce from 'lodash/reduce';
import moment from 'moment';

const durationRegex = /^((([0-1]?[0-9]h|[2][0-3]h)?\s([0-5]?[0-9]m))|([0-5]?[0-9]m)|([0-1]?[0-9]h|[2][0-4]h))$/;
const timeRegex = /^((?!Invalid Date).)*$/;

const getInitialTime = () => '';

export const defaultRepeatValues = {
  habit: {},
  specifics: '',
  place: '',
  time: getInitialTime(),
  sessionDuration: '',
};

export const parseDurationToMinutes = (val) =>
  val.split(' ').reduce((prev, current) => {
    const value = Number(current.slice(0, current.length - 1));
    const unit = current.substr(current.length - 1);
    if (unit === 'h') return prev + value * 60;
    return prev + value;
  }, 0);

const getTimeFromMinutes = (num) => {
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

export const getSlug = (name) => name.replace(' & ', '-').toLocaleLowerCase();

export const defaultRepeat = {
  habit: false,
  place: false,
  specifics: false,
  time: false,
  sessionDuration: false,
  openSpecifics: false,
};

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
      monday: values,
      tuesday: values,
      wednesday: values,
      thursday: values,
      friday: values,
      saturday: values,
      sunday: values,
    },
    repeatValues: defaultRepeatValues,
    repeat: defaultRepeat,
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
  `${date.startOf('week').format('MMM. Do')} - ${date
    .endOf('week')
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

export const getIsSameDay = ({ day, startDate }) => {
  const dayINeed = transformDay(day);
  const requestedDate = moment().clone().isoWeekday(dayINeed);
  return (
    moment().isSame(requestedDate, 'day') && !requestedDate.isBefore(startDate)
  );
};

export const getCalculatedDate = ({ day, time, startPlan, nWeek }) => {
  const dayINeed = transformDay(day);
  const [hour, minute] = time.split(':').map((e) => Number(e));
  const baseDate = moment(startPlan).set({ hour, minute });
  const requestedDate = baseDate.clone().isoWeekday(dayINeed);
  const allowSameDayToday =
    !baseDate.isAfter(requestedDate, 'day') &&
    requestedDate.isSame(moment(), 'day') &&
    !moment().isBefore(baseDate);
  if (isEmpty(startPlan)) return { disabled: false };
  const beforeUnit = time && allowSameDayToday ? 'minute' : 'day';
  const comparableDate = allowSameDayToday ? moment() : baseDate;
  const isBeforeRequested =
    requestedDate.isBefore(comparableDate, beforeUnit) && nWeek === 0;
  const isBeforeToday =
    moment().isAfter(requestedDate, beforeUnit) && nWeek === 0;
  if (isBeforeToday || isBeforeRequested) return { disabled: true };
  return {
    disabled: false,
    calculatedDate: getDateFromDay({
      dayINeed,
      time,
      startPlan,
      nWeek,
    }),
  };
};

const getHabit = (event) => {
  if (typeof event.habit === 'string') {
    return {
      habit: event.habit,
      text: event.habit,
      value: event.habit,
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
    const yearWeek = `${moment(date).weekYear()}-${moment(date).week()}`;
    const week = prev[yearWeek] || getWeekInitialValues();
    const dayName = moment(event.date || event.startDate)
      .format('dddd')
      .toLowerCase();
    const time = moment(event.date || event.startDate).format('HH:mm');
    week.days[dayName] = {
      time,
      checked: true,
      sessionDuration: parseMinutesToDuration(
        event.duration || event.sessionDuration
      ),
      habit: getHabit(event),
      place: event.place || event.location,
      specifics: event.specifics,
      openSpecifics: !!event.specifics,
    };
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
export const getPlanInitialValues = ({ initialValues }, isTemplate) => {
  if (initialValues) {
    return {
      createTemplate: isTemplate,
      createEvents: !isTemplate,
      group: undefined,
      templateName: '',
      goal: initialValues.name,
      startsOn: initialValues.repeatUntil ? 'select' : null,
      globalTemplate: Number(initialValues.globalTemplate),
      ...getWeeks({ initialValues }),
      ...(initialValues.repeatUntil && {
        date: moment(initialValues.repeatUntil),
      }),
    };
  }
  return {
    createTemplate: isTemplate,
    createEvents: !isTemplate,
    globalTemplate: 0,
    group: undefined,
    templateName: '',
    goal: '',
    date: null,
    week_1: {
      days: {
        monday: getInitial(),
        tuesday: getInitial(),
        wednesday: getInitial(),
        thursday: getInitial(),
        friday: getInitial(),
        saturday: getInitial(),
        sunday: getInitial(),
      },
      repeatValues: defaultRepeatValues,
      repeat: defaultRepeat,
    },
  };
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

export const getWeeksArrNum = (values) => {
  const weeks = Object.keys(values).filter((e) => /week/.test(e));
  return weeks.map((e) => Number(e.split('_')[1]));
};
export const getTotalPoints = (event) => {
  const checkIn = event.check_in_points || event.checkInPoints || 0;
  const intention = event.intention_points || event.intentionPoints || 0;
  return checkIn + intention;
};

const mapDays = (week) =>
  map(week, (dayInfo, day) => ({
    ...dayInfo,
    day: transformDay(day),
  }));

const getWeeksFromValues = (values) => {
  const keys = Object.keys(values).filter((val) => /week_/g.test(val));
  return keys.map((key) => {
    const val = {
      days: mapDays(values[key].days),
      week: Number(key.split('_')[1]),
    };
    return val;
  });
};

const getLower = (prev, current, field) =>
  prev[field] < current[field] ? prev : current;
const getBigger = (prev, current, field) =>
  prev[field] > current[field] ? prev : current;

const getPlanDate = ({ values, type }) => {
  if (!values.date) return null;
  const weeks = getWeeksFromValues(values);
  const week = weeks.reduce(
    (prev, current) =>
      type === 'bigger'
        ? getBigger(prev, current, 'week')
        : getLower(prev, current, 'week'),
    {}
  );
  const weekDays = filter(week.days, ({ checked }) => checked);
  const firstDay = weekDays.reduce(
    (prev, current) =>
      type === 'bigger'
        ? getBigger(prev, current, 'day')
        : getLower(prev, current, 'day'),
    {}
  );
  if (!firstDay.day) return null;
  const date = getDateFromDay({
    dayINeed: firstDay.day,
    nWeek: week.week - 1,
    time: '15:30',
    startPlan: values.date,
  });
  return date.format('MMM. Do');
};
export const getPlanStartDate = (values) =>
  getPlanDate({ values, type: 'lower' });

export const getPlanEndDate = (values) =>
  getPlanDate({ values, type: 'bigger' });

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

export const convertWeekToEvents = (data, startPlan) => {
  const values = map(data, (week) => mapDays(week.days));
  const weeksDays = map(values, (e) =>
    filter(e, ({ checked }) => checked)
  ).filter((e) => e.length > 0);
  return weeksDays.map((e, index) =>
    e.map((day) => {
      const dayMomentDate = getDateFromDay({
        dayINeed: day.day,
        nWeek: index,
        startPlan,
        time: day.time,
      });
      const baseValues = omit(day, [
        'specifics',
        'habit',
        'time',
        'sessionDuration',
        'checked',
        'day',
      ]);
      return {
        ...baseValues,
        date: moment.utc(dayMomentDate).format(),
        habit: day.habit.habit,
        category: day.habit.category,
        duration: parseDurationToMinutes(day.sessionDuration),
        ...(!!day.specifics && { specifics: day.specifics }),
      };
    })
  );
};
