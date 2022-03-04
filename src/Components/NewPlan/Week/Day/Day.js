/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change } from 'redux-form';
import moment from 'moment';
import { Button } from 'semantic-ui-react';
import { bem } from './utils';
import Event from './Event';
import { formName } from '../../BehaviorModal/utils';
import convertMeridiem from '../../../../utils/convertMeridiem';
import './Day.scss';

function Day({
  date,
  events,
  onAddNew,
  habits,
  disabled,
  changeFormValue,
  onOpenEditModal,
  mainFormName,
  behaviorFormName,
}) {
  function getDayInfo(habit) {
    return events.filter(
      (e) => habit === e.habit.value || habit === e.habit.habit
    );
  }
  function onClickCol(day) {
    onAddNew({ startDate: day });
    setTimeout(() => {
      changeFormValue(formName, 'date', day);
    }, 10);
  }
  return (
    <div className={bem('', { disabled })}>
      <div className={bem('date')}>
        <span className={bem('title')}>{date.clone().format('ddd')}</span>
        <span className={bem('description')}>
          {date.clone().format('MMM D')}
        </span>
      </div>
      <div className="flex flex-col w-full">
        {habits.map(({ habit }) => {
          const dayEvents = getDayInfo(habit.value);
          return dayEvents.map((data, index) => {
            const fullDate = data
              ? date.clone().set({
                  minutes: Number(data.time.minutes),
                  hours: convertMeridiem({
                    hour: data.time.hours,
                    format: data.time.format,
                  }),
                })
              : null;
            const isPast = fullDate && fullDate.isBefore(moment());
            return (
              <Event
                data={data}
                habit={habit}
                date={date}
                key={`event-${fullDate.format('X')}-${index + 1}`}
                onAddNew={onAddNew}
                changeFormValue={changeFormValue}
                onOpenEditModal={onOpenEditModal}
                disabled={disabled || isPast}
                behaviorFormName={behaviorFormName}
                mainFormName={mainFormName}
              />
            );
          });
        })}
        {!disabled && (
          <div className="hidden-el md:flex justify-center mb-4">
            <Button
              color="orange"
              className={bem('new')}
              onClick={() => onClickCol(date)}
            >
              +
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

Day.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape()),
  habits: PropTypes.arrayOf(PropTypes.shape()),
  date: PropTypes.shape(),
  onAddNew: PropTypes.func,
  onOpenEditModal: PropTypes.func,
  changeFormValue: PropTypes.func,
  behaviorFormName: PropTypes.string,
  mainFormName: PropTypes.string,
  disabled: PropTypes.bool,
};

export default connect(null, { changeFormValue: change })(Day);
