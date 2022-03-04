/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { Popup, Icon } from 'semantic-ui-react';
import showdown from 'showdown';
import { bem } from './utils';
import CategoryIcon from '../../../Elements/CategoriesIcons/CategoryIcon';
import { CheckBox } from '../../../ReduxForm';
import { getSlug } from '../../utils';
import convertMeridiem from '../../../../utils/convertMeridiem';

function Event({
  data,
  habit,
  date,
  disabled,
  onAddNew,
  mainFormName,
  onOpenEditModal,
  changeFormValue,
  behaviorFormName,
}) {
  const formatedDate = date.clone().format('MM-DD-YYYY');
  const triggerEl = useRef(null);
  const [openPopup, setOpenPopup] = useState(false);
  function onMoveMouse(e) {
    if (openPopup) {
      const popupEl = document.getElementById(
        `event-popup-${formatedDate}-${habit.value}`
      );
      const popupCondition = popupEl && !popupEl.contains(e.target);
      if (!triggerEl.current.contains(e.target) && popupCondition)
        setOpenPopup(false);
    }
  }
  function onDelete() {
    const dayUnix = date
      .clone()
      .set({
        minutes: data.time.minutes,
        hours: convertMeridiem({
          hour: data.time.hours,
          format: data.time.format,
        }),
        seconds: 0,
        milliseconds: 0,
      })
      .format('X');
    changeFormValue(
      mainFormName,
      `events.${habit.value}/${dayUnix}`,
      undefined
    );
  }
  function onEdit() {
    let converter = new showdown.Converter();
    const dayUnix = date
      .clone()
      .set({
        minutes: data.time.minutes,
        hours: convertMeridiem({
          hour: data.time.hours,
          format: data.time.format,
        }),
        seconds: 0,
        milliseconds: 0,
      })
      .format('X');
    onOpenEditModal();
    changeFormValue('edit-event', 'time', data.time);
    changeFormValue('edit-event', 'duration', data.duration);
    changeFormValue('edit-event', 'milestone', data.milestone);
    changeFormValue('edit-event', 'location', data.location);
    changeFormValue('edit-event', 'customPrompts', data.customPrompts);
    changeFormValue('edit-event', 'habit', data.habit);
    changeFormValue(
      'edit-event',
      'description',
      converter.makeHtml(data.habit.description)
    );
    changeFormValue('edit-event', 'date', date);
    changeFormValue('edit-event', 'oldKey', `${data.habit.value}/${dayUnix}`);
  }
  useEffect(() => {
    document.addEventListener('mousemove', onMoveMouse);
    return () => {
      document.removeEventListener('mousemove', onMoveMouse);
    };
  }, [openPopup]);
  function onChangeCheckBox({ active }) {
    const baseData = active ? data : habit.initialValues;
    const dayUnix = date
      .clone()
      .set({
        minutes: baseData.time.minutes,
        hours: convertMeridiem({
          hour: baseData.time.hours,
          format: baseData.time.format,
        }),
        seconds: 0,
        milliseconds: 0,
      })
      .format('X');
    if (active)
      changeFormValue(
        mainFormName,
        `events.${data.habit.value}/${dayUnix}`,
        undefined
      );
    else if (habit.initialValues) {
      changeFormValue(mainFormName, `events.${habit.value}/${dayUnix}`, {
        date,
        habit: omit(habit, 'initialValues'),
        ...habit.initialValues,
      });
    } else {
      onAddNew({
        startDate: date,
        endDate: date,
      });
      changeFormValue(behaviorFormName, 'habit', habit);
      changeFormValue(behaviorFormName, 'date', date);
    }
  }
  return (
    <Popup
      hoverable
      id={`event-popup-${formatedDate}-${habit.value}`}
      open={openPopup}
      className={bem('popup')}
      {...(data && !disabled && { onOpen: () => setOpenPopup(true) })}
      trigger={
        <div ref={triggerEl}>
          <div
            className={cx(
              bem('event', { disabled, active: !!data && !disabled }),
              {
                'justify-start md:justify-center': !data || disabled,
                'justify-center': !!data,
              }
            )}
          >
            {!disabled && (
              <CheckBox
                onChange={() => onChangeCheckBox({ active: !!data })}
                value={!!data}
                className={cx({ 'mr-2': !!data })}
              />
            )}
            {data && (
              <div className="flex flex-col items-center md:items-start">
                <span className={bem('time')}>
                  {data.time.hours}:{data.time.minutes}
                  {data.time.format}
                </span>
                <span className={bem('duration')}>
                  {data.duration.hours && Number(data.duration.hours)
                    ? `${data.duration.hours}h `
                    : ''}
                  {data.duration.minutes && Number(data.duration.minutes)
                    ? `${data.duration.minutes}m`
                    : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      }
      position="bottom center"
    >
      {data && !disabled && (
        <div>
          <div className={bem('popup--title')}>
            <CategoryIcon
              active
              name={habit.category}
              slug={getSlug(habit.category)}
            />
            <span>
              {habit.habit} on {date.clone().format('dddd, MMM D')}
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
          <div className={bem('popup--field')}>
            <div className={bem('popup--field-title')}>
              <i className="far fa-question-circle" />
              <span>Prompts:</span>
            </div>
            <div className="flex flex-col">
              {data.customPrompts.active ? (
                data.customPrompts.prompts.map((promp, index) => (
                  <span
                    key={`prompt-${index + 1}`}
                    className={bem('popup--field-description')}
                  >
                    {promp}
                  </span>
                ))
              ) : (
                <span className={bem('popup--field-description')}>- -</span>
              )}
            </div>
          </div>
          <div className={bem('popup--field')}>
            <div className={bem('popup--field-title')}>
              <Icon name="flag" />
              <span>Milestone:</span>
            </div>
            {data.milestone.active ? (
              <span className={bem('popup--field-description')}>
                {data.milestone.description}
              </span>
            ) : (
              <span className={bem('popup--field-description')}>- -</span>
            )}
          </div>
          <div className={bem('popup--edit')}>
            <div onClick={onEdit}>
              <Icon name="pencil" />
              Edit
            </div>
            <div onClick={onDelete} className="ml-8">
              <Icon name="trash" />
              Delete
            </div>
          </div>
        </div>
      )}
    </Popup>
  );
}

Event.propTypes = {
  data: PropTypes.shape(),
  habit: PropTypes.shape(),
  behaviorFormName: PropTypes.string,
  mainFormName: PropTypes.string,
  changeFormValue: PropTypes.func,
  onOpenEditModal: PropTypes.func,
  onAddNew: PropTypes.func,
  disabled: PropTypes.bool,
  date: PropTypes.shape(),
};

export default Event;
