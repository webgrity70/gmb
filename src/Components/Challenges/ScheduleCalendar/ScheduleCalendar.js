/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment-timezone';
import { Popup, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { connect } from 'react-redux';
import { formValueSelector, change, touch } from 'redux-form';
import uniqBy from 'lodash/uniqBy';
import { fillNewPlanDays } from '../../Plan/Calendar/utils';
import usePrevious from '../../../hooks/use-previous';
import { CategoryIcon } from '../../Elements/CategoriesIcons';
import EditMultiEventModal from '../../NewPlan/MultiEditEvent';
// import convertMeridiem from '../../../utils/convertMeridiem';
import { getSlug, parseDurationToMinutes } from '../../NewPlan/utils';
import { getSaveAsTemplateEvent } from '../../Plan/EventDetailsModal/utils';
import SaveEventAsTemplate from '../../Plan/SaveEventAsTemplate/SaveEventAsTemplate';
import EditEvent from '../../NewPlan/EditEvent';
import convertMeridiem from '../../../utils/convertMeridiem';
import './ScheduleCalendar.scss';
import indexesToPrompts from '../../../utils/indexesToPrompts';
import omit from 'lodash/omit';

const bem = BEMHelper({ name: 'SchedulaCalendar', outputIsString: true });

function Event({ data, onOpenEditModal, changeFormValue }) {
  const formatedDate = data.date.clone().format('X');
  const key = `event-popup-${formatedDate}-${data.habit.value}`;
  const templateModalKey = `template-modal-${formatedDate}-${data.habit.value}`;
  const [openPopup, setOpenPopup] = useState(false);
  const triggerEl = useRef(null);
  /* const fullDate = data.date.clone().set({
    minutes: Number(data.time.minutes),
    hours: convertMeridiem({ hour: data.time.hours, format: data.time.format }),
  });
  const isPast = fullDate && fullDate.isBefore(moment()); */
  function onMoveMouse(e) {
    if (openPopup) {
      const popupEl = document.getElementById(key);
      const popupCondition = popupEl && !popupEl.contains(e.target);
      const templateEl = document.getElementById(templateModalKey);
      if (
        !triggerEl.current.contains(e.target) &&
        popupCondition &&
        !templateEl
      )
        setOpenPopup(false);
    }
  }
  function onOpenEdit() {
    const dayUnix = data.date
      .clone()
      .set({
        minutes: Number(data.time.minutes),
        hours: convertMeridiem({
          hour: data.time.hours,
          format: data.time.format,
        }),
        seconds: 0,
        milliseconds: 0,
      })
      .format('X');
    onOpenEditModal(data);
    changeFormValue('edit-event', 'time', data.time);
    changeFormValue('edit-event', 'duration', data.duration);
    changeFormValue('edit-event', 'milestone', data.milestone);
    changeFormValue('edit-event', 'location', data.location);
    changeFormValue(
      'edit-event',
      'customPrompts',
      indexesToPrompts(data.customPrompts.prompts)
    );
    changeFormValue('edit-event', 'templateID', data.templateID);
    changeFormValue('edit-event', 'habit', data.habit);
    changeFormValue('edit-event', 'description', data.habit.description);
    changeFormValue('edit-event', 'date', data.date);
    changeFormValue('edit-event', 'oldKey', `${data.habit.value}/${dayUnix}`);
  }
  useEffect(() => {
    document.addEventListener('mousemove', onMoveMouse);
    return () => {
      document.removeEventListener('mousemove', onMoveMouse);
    };
  }, [openPopup]);
  return (
    <Popup
      hoverable
      id={key}
      open={openPopup}
      position="bottom center"
      className={bem('popup')}
      onOpen={() => setOpenPopup(true)}
      trigger={
        <div className={bem('event')} ref={triggerEl}>
          <div className="flex flex-col items-center md:items-start">
            <span className={bem('event-time')}>
              {data.time.hours}:{data.time.minutes}
              {data.time.format}
            </span>
            <span className={bem('event-duration')}>
              {data.duration.hours && Number(data.duration.hours)
                ? `${data.duration.hours}h `
                : ''}
              {data.duration.minutes && Number(data.duration.minutes)
                ? `${data.duration.minutes}m`
                : ''}
            </span>
          </div>
        </div>
      }
    >
      <div>
        <div className={bem('popup--title')}>
          <CategoryIcon
            active
            name={data.habit.category}
            slug={getSlug(data.habit.category)}
          />
          <span>
            {data.habit.habit} on {data.date.clone().format('dddd, MMM D')}
          </span>
        </div>
        <div className={bem('popup--field')}>
          <div className={bem('popup--field-title')}>
            <Icon name="clock" />
            <span>Time:</span>
          </div>
          <span className={bem('popup--field-description')}>
            {data.time.hours}:{data.time.minutes}
            {data.time.format}
          </span>
        </div>
        <div className={bem('popup--field')}>
          <div className={bem('popup--field-title')}>
            <Icon name="hourglass half" />
            <span>Duration:</span>
          </div>
          <span className={bem('popup--field-description')}>
            {data.duration.hours ? `${data.duration.hours}hrs ` : ''}
            {data.duration.minutes ? `${data.duration.minutes}min` : ''}
          </span>
        </div>
        <div className={bem('popup--field')}>
          <div className={bem('popup--field-title')}>
            <Icon name="map marker alternate" />
            <span>Location:</span>
          </div>
          <span className={bem('popup--field-description')}>
            {data.location}
          </span>
        </div>
        <div className={bem('popup--edit')}>
          <SaveEventAsTemplate
            event={getSaveAsTemplateEvent({
              ...data,
              start: data.date.clone().utc().format(),
              createEvent: false,
              duration: parseDurationToMinutes(
                `${data.duration.hours}h ${data.duration.minutes}m`
              ),
              ...(data.milestone.active && {
                milestone: data.milestone.description,
              }),
              ...(data.customPrompts.active && {
                prompts: indexesToPrompts(data.customPrompts.prompts),
              }),
            })}
            id={templateModalKey}
            trigger={
              <div>
                <Icon name="file" />
                Save as Template
              </div>
            }
          />
          <div onClick={onOpenEdit}>
            <Icon name="pencil" />
            Edit
          </div>
        </div>
      </div>
    </Popup>
  );
}

const ConnectedEvent = connect(null, { changeFormValue: change })(Event);

Event.propTypes = {
  data: PropTypes.shape(),
  changeFormValue: PropTypes.func,
  onOpenEditModal: PropTypes.func,
};

function Days({ data, events, onOpenEditModal, habits }) {
  return data.map((day, indexDay) => {
    const dayEvents = events.filter(
      (e) => e.date.clone().day() === day.clone().day()
    );
    return (
      <div className={bem('day')} key={`schedule-day-${indexDay + 1}`}>
        <div className={bem('day-date')}>
          <span className={bem('day-title')}>{day.clone().format('ddd')}</span>
          {/* <span className={bem('day-description')}>{day.clone().format('MMM D')}</span> */}
        </div>
        <div className="flex flex-col w-full">
          {habits.map(({ habit }) => {
            const habitEvents = dayEvents.filter(
              (e) =>
                habit.value === e.habit.value || habit.value === e.habit.habit
            );
            return habitEvents.map((event, index) => (
              <ConnectedEvent
                key={`event-schedule-${index + 1}`}
                onOpenEditModal={onOpenEditModal}
                data={event}
              />
            ));
          })}
        </div>
      </div>
    );
  });
}
function ScheduleCalendar({
  events,
  endDate,
  formName,
  startDate,
  touchField,
  isConsecutive,
  canChangeTime,
  changeFormValue,
  canChangeDetails,
  canChangeDuration,
  canChangeLocation,
}) {
  const [weeks, setWeeks] = useState([]);
  const prevStart = usePrevious(startDate);
  const prevEnd = usePrevious(endDate);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openMultiEditModal, setOpenMultiEditModal] = useState(false);
  function onCloseEditModal() {
    setOpenEditModal(false);
  }
  function onSubmitEditForm(values, oldEventKey) {
    if (startDate.isAfter(values.date)) {
      changeFormValue(formName, 'date', {
        startDate: values.date.clone(),
        endDate,
      });
    }
    if (endDate.isBefore(values.date)) {
      changeFormValue(formName, 'date', {
        endDate: values.date.clone(),
        startDate,
      });
    }
    const dayUnix = values.date
      .clone()
      .set({
        minutes: Number(values.time.minutes),
        hours: convertMeridiem({
          hour: values.time.hours,
          format: values.time.format,
        }),
        seconds: 0,
        milliseconds: 0,
      })
      .format('X');

    const newEventKey = `${values.habit.value}/${dayUnix}`;
    if (newEventKey !== oldEventKey)
      changeFormValue(formName, `events.${oldEventKey}`, undefined);
    changeFormValue(formName, `events.${newEventKey}`, values);
    onCloseEditModal();
  }
  function onSubmitMultiEdit(data, baseHabit) {
    setOpenMultiEditModal(false);
    events
      .filter((e) => e.habit.value === baseHabit.value)
      .forEach((event) => {
        const eventData = {
          ...event,
          habit: {
            ...event.habit,
            ...omit(data.habit, ['showDetails']),
            description: data.habit.showDetails
              ? data.habit.description
              : event.habit.description,
          },
          ...(data.time.hours && { time: data.time }),
          ...(data.location && { location: data.location }),
          ...((data.duration.hours || data.duration.minutes) && {
            duration: data.duration,
          }),
        };
        const initialDayUnix = event.date
          .clone()
          .set({
            minutes: event.time.minutes,
            hours: convertMeridiem({
              hour: event.time.hours,
              format: event.time.format,
            }),
            seconds: 0,
            milliseconds: 0,
          })
          .format('X');
        const key = `${event.habit.value}/${initialDayUnix}`;
        const dayUnix = event.date
          .clone()
          .set({
            minutes: eventData.time.minutes,
            hours: convertMeridiem({
              hour: eventData.time.hours,
              format: eventData.time.format,
            }),
            seconds: 0,
            milliseconds: 0,
          })
          .format('X');
        const newKey = `${eventData.habit.value}/${dayUnix}`;
        if (key !== newKey)
          changeFormValue(formName, `events.${key}`, undefined);
        changeFormValue(formName, `events.${newKey}`, eventData);
      });
  }
  function onOpenEditModal(event) {
    const limitDate = (() => {
      const nextEvent = events.find((e) =>
        e.date.clone().isAfter(event.date.clone())
      );
      if (!nextEvent || !isConsecutive) return null;
      const fullDate = nextEvent.date.clone().set({
        hours: convertMeridiem({
          hour: nextEvent.time.hours,
          format: nextEvent.time.format,
        }),
        minutes: Number(nextEvent.time.minutes),
        seconds: 0,
        milliseconds: 0,
      });
      return fullDate.format();
    })();
    if (limitDate) {
      touchField('edit-event', 'time');
      changeFormValue('edit-event', 'limitDate', limitDate);
    }
    changeFormValue('edit-event', 'disableTime', canChangeTime === 'no');
    changeFormValue(
      'edit-event',
      'disableDate',
      canChangeTime === 'no' || canChangeTime === '24h'
    );
    setOpenEditModal(true);
  }
  function onOpenMultiEditModal(habit) {
    changeFormValue('multi-edit-event', 'habit', habit);
    changeFormValue('multi-edit-event', 'initialHabit', habit);
    setOpenMultiEditModal(true);
  }
  useEffect(() => {
    const isInitialStart = startDate && !prevStart;
    const hasPrevStart =
      prevStart && prevStart.clone().unix() !== startDate.clone().unix();
    const diffStart = isInitialStart || hasPrevStart;
    const isInitialEnd = endDate && !prevEnd;
    const hasPrevEnd =
      prevEnd && prevEnd.clone().unix() !== endDate.clone().unix();
    const diffEnd = isInitialEnd || hasPrevEnd;
    if (diffStart || diffEnd) {
      const newWeeks = fillNewPlanDays({ startDate, endDate });
      setWeeks(newWeeks);
    }
  }, [startDate, endDate, prevStart, prevEnd]);
  return (
    <div>
      {weeks.map(({ days }, index) => {
        const weekEvents = events.filter(
          (e) => e.date.clone().week() === days[0].clone().week()
        );
        const habits = uniqBy(weekEvents, (event) => event.habit.value);
        return (
          <div className={bem()} key={`schedule-week-${index + 1}`}>
            <div className={bem('week-title')}>
              WEEK {index + 1}: {days[0].clone().format('MMM D')} -{' '}
              {days[days.length - 1].clone().format('MMM D')}
            </div>
            <div className={bem('week-content')}>
              <div className="pb-3 md:pb-0 px-3 pt-0 md:pt-12">
                {habits.map(({ habit }) => (
                  <div
                    className={bem('week-habit')}
                    key={`schedule-habit-${habit.value}`}
                  >
                    <CategoryIcon
                      name={habit.category}
                      slug={habit.slug}
                      active
                      fullColor
                    />
                    <span>{habit.habit}</span>
                    <Icon
                      name="pencil"
                      onClick={() => onOpenMultiEditModal(habit)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-1 flex-wrap">
                <Days
                  data={days}
                  events={weekEvents}
                  habits={habits}
                  key={`schedule-days-${index + 1}`}
                  onOpenEditModal={onOpenEditModal}
                />
              </div>
            </div>
          </div>
        );
      })}
      <EditEvent
        isRegularChallenge
        open={openEditModal}
        onClose={onCloseEditModal}
        onSubmitForm={onSubmitEditForm}
        disableLocation={!canChangeLocation}
        disableDuration={!canChangeDuration}
        disableSpecifics={!canChangeDetails}
        {...(startDate && { maxEndDate: endDate })}
      />
      <EditMultiEventModal
        open={openMultiEditModal}
        onClose={() => setOpenMultiEditModal(false)}
        onSubmitForm={onSubmitMultiEdit}
        disableHabit
        disableLocation={!canChangeLocation}
        disableDetails={!canChangeDetails}
        disableDuration={!canChangeDuration}
        disableTime={canChangeTime === 'no'}
      />
    </div>
  );
}

const mapStateToProps = (state, { formName }) => {
  const events = formValueSelector(formName)(state, 'events');
  if (!events) return { weeks: [] };
  const eventsKeys = Object.keys(events).sort((a, b) => {
    const firstUnix = a.split('/')[1];
    const lastUnix = b.split('/')[1];
    return new Date(firstUnix * 1000) - new Date(lastUnix * 1000);
  });
  const startDate = eventsKeys[0].split('/')[1];
  const endDate = eventsKeys[eventsKeys.length - 1].split('/')[1];
  return {
    startDate: moment(new Date(startDate * 1000)),
    endDate: moment(new Date(endDate * 1000)),
    events: Object.values(events),
  };
};

ScheduleCalendar.propTypes = {
  formName: PropTypes.string,
  changeFormValue: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.shape()),
  canChangeDetails: PropTypes.bool,
  canChangeDuration: PropTypes.bool,
  canChangeLocation: PropTypes.bool,
  canChangeTime: PropTypes.string,
  isConsecutive: PropTypes.bool,
  touchField: PropTypes.func,
  startDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  endDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
};

export default connect(mapStateToProps, {
  changeFormValue: change,
  touchField: touch,
})(ScheduleCalendar);
