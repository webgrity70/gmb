/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import uniqBy from 'lodash/uniqBy';
import BEMHelper from 'react-bem-helper';
import Day from './Day';
import Habits from './Habits';

import './Week.scss';

const bem = BEMHelper({ name: 'NewPlanWeek', outputIsString: true });

function Week({
  week,
  events,
  days,
  onAddNew,
  startDate,
  editing,
  mainFormName,
  onOpenDeleteModal,
  onOpenMultiEditModal,
  onOpenEditModal,
  behaviorFormName,
}) {
  const uniqueHabits = uniqBy(events, (event) => event.habit.value);
  const disabledWeek = days[days.length - 1].isBefore(moment(), 'today');
  function onAddNewWeek() {
    const start = days[0].clone().isAfter(moment()) ? days[0] : moment();
    onAddNew({
      startDate: start,
      endDate: days[days.length - 1],
    });
  }
  return (
    <div className={bem('week')}>
      <div className={bem('title')}>
        WEEK {week}: {days[0].clone().format('MMM D')} -{' '}
        {days[days.length - 1].clone().format('MMM D')}
      </div>
      <div className={bem('content')}>
        <div className={cx({ [bem('disabled')]: disabledWeek })}>
          <Habits
            habits={uniqueHabits}
            onOpenDelete={onOpenDeleteModal}
            editing={editing}
            onOpenMultiEditModal={(habit) =>
              onOpenMultiEditModal({
                habit,
                start: days[0],
                end: days[days.length - 1],
              })
            }
          />
          {!disabledWeek && (
            <div className={bem('new')} onClick={onAddNewWeek}>
              + New Event this week
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-wrap">
          {days.map((day, dayIndex) => (
            <Day
              key={`new-calendar-week-${week}-day-${dayIndex + 1}`}
              date={day}
              events={events.filter(
                (event) =>
                  event.date.clone().format('MM-DD-YYYY') ===
                  day.clone().format('MM-DD-YYYY')
              )}
              habits={uniqueHabits}
              disabled={
                day.isBefore(moment(), 'day') || day.isBefore(startDate, 'day')
              }
              onAddNew={onAddNew}
              onOpenEditModal={onOpenEditModal}
              startDate={startDate}
              behaviorFormName={behaviorFormName}
              mainFormName={mainFormName}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

Week.propTypes = {
  days: PropTypes.arrayOf(PropTypes.shape()),
  week: PropTypes.number,
  events: PropTypes.arrayOf(PropTypes.shape()),
  onOpenMultiEditModal: PropTypes.func,
  onAddNew: PropTypes.func,
  editing: PropTypes.bool,
  startDate: PropTypes.shape(),
  onOpenDeleteModal: PropTypes.func,
  onOpenEditModal: PropTypes.func,
  behaviorFormName: PropTypes.string,
  mainFormName: PropTypes.string,
};

export default Week;
