/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import cx from 'classnames';
import capitalize from 'lodash/capitalize';
import { Checkbox } from 'semantic-ui-react';
import { bem } from './utils';
import Behaviors from '../Behaviors';
import MDEEditor from '../../Elements/MDEditor/MdeEditor';
import Time from '../Time';
import Place from '../Place';
import Duration from '../Duration';
import { getCalculatedDate, getIsSameDay, getObjectDiff } from '../utils';

const Day = ({
  day,
  errors = {},
  values = {},
  onCheckDay,
  onChangeHabit,
  profileId,
  isMobile,
  nWeek,
  onChangeTime,
  categories,
  startDate,
  onChangePlace,
  onChangeSessionDurantion,
  setFieldError,
  onChangeSpecifics,
  onOpenSpecifics,
  timeFormat,
}) => {
  const [calculatedDate, setCalculatedDate] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const sameDay = getIsSameDay({ startDate, day });
  useEffect(() => {
    if (disabled && !errors.time && sameDay)
      setFieldError(`week_1.${day}.time`, 'Past Day');
  }, [errors]);
  useEffect(() => {
    if (!startDate && calculatedDate) setCalculatedDate(null);
  }, [startDate]);
  useEffect(() => {
    const data = getCalculatedDate({
      startPlan: startDate,
      day,
      time: values.time,
      nWeek,
    });
    const shouldDesactivate = !disabled && data.disabled;
    const previousDisabled = disabled && !data.disabled;
    const activateCalculated = previousDisabled && data.calculatedDate;
    const shouldActivate = previousDisabled || activateCalculated;
    if (shouldActivate) setDisabled(false);
    if (shouldDesactivate) setDisabled(true);
    if (data.calculatedDate) setCalculatedDate(data.calculatedDate);
  }, [startDate, values.time, values.checked]);
  function openFullScreen(ref) {
    if (isMobile && ref && !values.specifics)
      ref.toolbarElements.fullScreen.click();
  }
  function CalculatedDate() {
    if (calculatedDate || disabled) {
      return (
        <span className={bem('calculated-date')}>
          {calculatedDate && !disabled
            ? calculatedDate.format('MMM. Do')
            : null}
        </span>
      );
    }
    return null;
  }
  const onChangeDayTime = useCallback(
    (value) => onChangeTime({ value, day }),
    onChangeTime
  );
  function renderEditor() {
    const isOpen = !!values.specifics || values.openSpecifics;
    return (
      !!get(values.habit, 'value', null) && (
        <div className={bem('mde-editor')}>
          {isOpen ? (
            <MDEEditor
              value={values.specifics}
              getInstance={openFullScreen}
              onChange={(value) => onChangeSpecifics({ value, day })}
              placeholder={`What specifically do you intend to do

e.g., 2 miles at a 7 minute pace, pgs 12-30 of Behavioral Psychology?
                    `}
            />
          ) : (
            <a onClick={() => onOpenSpecifics(day)}>Add event specifics +</a>
          )}
        </div>
      )
    );
  }
  function getChecked() {
    const checkedNoDisabled = values.checked && !disabled;
    const sameDayChecked = values.checked && sameDay;
    if (checkedNoDisabled || sameDayChecked) return true;
    return false;
  }
  return (
    <div
      className={cx('flex', { [bem('day-disabled')]: disabled && !sameDay })}
    >
      <div className="flex flex-col">
        <Checkbox
          label={capitalize(day)}
          className={bem('day')}
          checked={getChecked()}
          disabled={disabled && !sameDay}
          onChange={() => onCheckDay(day)}
        />
        <CalculatedDate />
      </div>
      <div className={bem('fields')}>
        <Behaviors
          profileId={profileId}
          categories={categories}
          onChangeHabit={(habit) => onChangeHabit({ habit, day })}
          values={{
            habit: values.habit,
          }}
          errors={{
            habit: !!errors.habit && !disabled,
          }}
          showHeader={false}
        />
        {isMobile && renderEditor(day)}
        <Time
          onChange={onChangeDayTime}
          value={values.time}
          showHeader={false}
          disabled={disabled && !sameDay}
          error={!!errors.time}
          timeFormat={timeFormat}
          pastDay={disabled && sameDay}
        />
        <Place
          onChange={(_, { value }) => onChangePlace({ day, value })}
          value={values.place}
          showHeader={false}
          error={!!errors.place && !disabled}
        />
        <Duration
          onChange={(_, { value }) => onChangeSessionDurantion({ value, day })}
          values={{
            duration: values.sessionDuration,
          }}
          errors={{
            duration: !!errors.sessionDuration && !disabled,
          }}
          showHeader={false}
        />
        {!isMobile && renderEditor(day)}
      </div>
    </div>
  );
};

Day.propTypes = {
  day: PropTypes.string,
  isMobile: PropTypes.bool,
  errors: PropTypes.shape(),
  values: PropTypes.shape(),
  onCheckDay: PropTypes.func,
  onChangeHabit: PropTypes.func,
  profileId: PropTypes.number,
  onChangeTime: PropTypes.func,
  onChangePlace: PropTypes.func,
  onChangeSessionDurantion: PropTypes.func,
  onChangeSpecifics: PropTypes.func,
  onOpenSpecifics: PropTypes.func,
  timeFormat: PropTypes.string,
  setFieldError: PropTypes.func,
  startDate: PropTypes.shape(),
  nWeek: PropTypes.number,
  categories: PropTypes.arrayOf(PropTypes.shape()),
};

const MemoDay = React.memo(Day, (prevProps, nextProps) => {
  // need to compare only objects and without return the result;
  const diffValues = getObjectDiff(
    {
      errors: prevProps.errors,
      timeFormat: prevProps.timeFormat,
      startDate: prevProps.startDate,
      values: prevProps.values,
      categories: prevProps.categories.length,
    },
    {
      errors: nextProps.errors,
      timeFormat: nextProps.timeFormat,
      startDate: nextProps.startDate,
      values: nextProps.values,
      categories: nextProps.categories.length,
    }
  );
  if (diffValues.length === 0) return true;
  return false;
});
export default MemoDay;
