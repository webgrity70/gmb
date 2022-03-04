/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import BEMHelper from 'react-bem-helper';
import { change, formValueSelector } from 'redux-form';
import { Modal } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { fillNewPlanDays } from '../../Plan/Calendar/utils';
import Week from '../Week';
import { RadioOptions } from '../../ReduxForm';
import EditEventModal from '../EditEvent';
import EditMultiEventModal from '../MultiEditEvent';
import { getWeekInterval, getEvents, getDeletableEventsKeys } from './utils';
import { transformDay, getGroupsOfWeeks, getWeeksKeys } from '../utils';
import convertMeridiem from '../../../utils/convertMeridiem';
import './Calendar.scss';
import omit from 'lodash/omit';

const bem = BEMHelper({ name: 'NewPlanCalendar', outputIsString: true });

function Calendar({
  events,
  editing,
  endDate,
  onAddNew,
  formName,
  startDate,
  changeFormValue,
  behaviorFormName,
}) {
  if (!startDate && !endDate) return null;
  const [weeks, setWeeks] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openMultiEditModal, setOpenMultiEditModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteSettings, setDeleteSettings] = useState({
    date: null,
    habit: {},
  });
  const [deleteOption, setDeleteOption] = useState('all');

  useEffect(() => {
    const hasDates = startDate;
    if (hasDates) {
      let _events = { ...events };
      changeFormValue(formName, 'events', {});
      let newEndDate;
      if (Object.keys(_events).length > 0) {
        let hour = Number(Object.values(_events)[0].time.hours);
        let minute = Number(Object.values(_events)[0].time.minutes);
        let startDay = startDate.clone().set({ hour, minute });
        let firstEventDay = Object.values(_events)[0].date;
        let diff = startDay.diff(firstEventDay, 'days');

        _events = Object.values(_events).reduce((prev, event) => {
          let newDate = event.date.clone().add(diff, 'days');
          /*
          const [timeHours, timeMinutes, format] = newDate
            .clone()
            .format('hh:mm:A')
            .split(':');
          */
          let timeHours = Number(event.time.hours);
          let timeMinutes = Number(event.time.minutes);
          let format = event.time.format;

          let newDayUnix = newDate
            .clone()
            .set({
              minutes: Number(timeMinutes),
              hours: convertMeridiem({ hour: timeHours, format }),
              seconds: 0,
              milliseconds: 0,
            })
            .format('X');
          newEndDate = newDate;
          return {
            ...prev,
            [`${event.habit.value}/${newDayUnix}`]: {
              ...event,
              date: newDate,
            },
          };
        }, {});
      }
      if (!endDate) {
        endDate = newEndDate;
        changeFormValue(formName, 'date', {
          startDate,
          endDate: endDate,
        });
      }

      if (startDate && endDate) {
        setWeeks(fillNewPlanDays({ startDate, endDate }));
        const groupsOfWeeks = getGroupsOfWeeks(_events, startDate, endDate);
        const weeksKeys = getWeeksKeys(groupsOfWeeks);
        weeksKeys.forEach((weekKey, index) => {
          const startWeek = startDate
            .clone()
            .startOf('week')
            .add(index, 'week');
          Object.keys(groupsOfWeeks[weekKey]).forEach((day) => {
            const isoWeekday = transformDay(day);
            groupsOfWeeks[weekKey][day].map((oldKey) => {
              const [habitValue] = oldKey.split('/');
              const { time } = _events[oldKey];
              const newDate = startWeek
                .clone()
                .isoWeekday(isoWeekday)
                .set({
                  minutes: time.minutes,
                  hours: convertMeridiem({
                    hour: time.hours,
                    format: time.format,
                  }),
                  seconds: 0,
                  milliseconds: 0,
                });
              const newKey = `${habitValue}/${newDate.clone().format('X')}`;
              if (newDate.isAfter(moment())) {
                changeFormValue(formName, `events.${newKey}`, {
                  ..._events[oldKey],
                  date: newDate,
                });
              }
            });
          });
        });
      }
    }
  }, [startDate, endDate]);
  function onCloseModal() {
    if (deleteSettings.date) setDeleteSettings({ date: null, habit: {} });
    setOpenDeleteModal(false);
  }
  function onOpenModal(day, habit) {
    setDeleteSettings({ date: day, habit });
    setOpenDeleteModal(true);
  }
  function onCloseEditModal() {
    setOpenEditModal(false);
  }
  function onSubmitMultiEdit(data, baseHabit) {
    setOpenMultiEditModal(false);
    Object.keys(events)
      .filter((e) => new RegExp(`${baseHabit.value}/`).test(e))
      .map((key) => ({ ...events[key], key }))
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
        if (event.key !== newKey) {
          changeFormValue(formName, `events.${event.key}`, undefined);
        }
        changeFormValue(formName, `events.${newKey}`, eventData);
      });
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
        minutes: values.time.minutes,
        hours: convertMeridiem({
          hour: values.time.hours,
          format: values.time.format,
        }),
        seconds: 0,
        milliseconds: 0,
      })
      .format('X');

    const newEventKey = `${values.habit.value}/${dayUnix}`;
    if (oldEventKey !== newEventKey)
      changeFormValue(formName, `events.${oldEventKey}`, undefined);
    changeFormValue(formName, `events.${newEventKey}`, values);
    onCloseEditModal();
  }
  function onDeleteEvent(eventKey) {
    onCloseEditModal();
    changeFormValue(formName, `events.${eventKey}`, undefined);
  }
  function onOpenMultiEditModal({ habit /* start, end */ }) {
    changeFormValue('multi-edit-event', 'habit', habit);
    changeFormValue('multi-edit-event', 'initialHabit', habit);
    setOpenMultiEditModal(true);
  }
  function onDelete() {
    const deletableKeys = getDeletableEventsKeys({
      events,
      deleteOption,
      deleteSettings,
      startDate,
      endDate,
    });
    deletableKeys.forEach((event) =>
      changeFormValue(formName, `events.${event}`, undefined)
    );
    onCloseModal();
  }
  return (
    <div className={bem()}>
      {weeks.map((week, weekIndex) => {
        const weekNumber = weekIndex + 1;
        return (
          <Week
            week={weekNumber}
            key={`new-calendar-week-${weekNumber}`}
            days={week.days}
            editing={editing}
            events={getEvents({ comparableDate: week.days[0], events })}
            onAddNew={onAddNew}
            startDate={startDate}
            endDate={endDate}
            onOpenEditModal={() => setOpenEditModal(true)}
            onOpenMultiEditModal={onOpenMultiEditModal}
            onOpenDeleteModal={(habit) => onOpenModal(week.days[0], habit)}
            mainFormName={formName}
            behaviorFormName={behaviorFormName}
          />
        );
      })}

      <EditMultiEventModal
        open={openMultiEditModal}
        onClose={() => setOpenMultiEditModal(false)}
        onSubmitForm={onSubmitMultiEdit}
      />
      <EditEventModal
        open={openEditModal}
        onClose={onCloseEditModal}
        onSubmitForm={onSubmitEditForm}
        onDelete={onDeleteEvent}
      />
      <Modal
        dimmer="inverted"
        open={openDeleteModal}
        onClose={onCloseModal}
        closeOnDimmerClick={false}
        className={bem('modal')}
        size="small"
      >
        <Modal.Content>
          <h2>Delete Event?</h2>
          <RadioOptions
            value={deleteOption}
            options={[
              {
                label: `Delete all '${deleteSettings.habit.habit}' events`,
                value: 'all',
              },
              {
                label: `Delete '${
                  deleteSettings.habit.habit
                }' events from selected week ${getWeekInterval(
                  deleteSettings
                )}`,
                value: 'week',
              },
            ]}
            onChange={(val) => setDeleteOption(val)}
          />
        </Modal.Content>
        <Modal.Actions>
          <a className="pointer" onClick={onCloseModal}>
            Cancel
          </a>
          <a className="pointer" onClick={onDelete}>
            OK
          </a>
        </Modal.Actions>
      </Modal>
    </div>
  );
}

Calendar.propTypes = {
  startDate: PropTypes.shape(),
  endDate: PropTypes.shape(),
  editing: PropTypes.bool,
  onAddNew: PropTypes.func,
  events: PropTypes.shape(),
  behaviorFormName: PropTypes.string,
  formName: PropTypes.string,
  changeFormValue: PropTypes.func,
};

/* export default connect(
  mapStateToProps,
  { changeFormValue: change },
)(Calendar);
 */

const mapStateToProps = (state, { formName }) => {
  const selector = formValueSelector(formName);
  const { date, events } = selector(state, 'date', 'events');
  return {
    ...date,
    events,
  };
};
export default connect(mapStateToProps, { changeFormValue: change })(Calendar);
