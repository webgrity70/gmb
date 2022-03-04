import React, { useState, useContext } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { SingleDatePicker } from 'react-dates';
import './DatePicker.scss';
import PlanContext from '../../Plan/PlanContext';

const DatePicker = ({ value, onChange, error, className, openDirection }) => {
  const { dateFormat } = useContext(PlanContext);
  const [pickerFocused, setPickerFocused] = useState(false);
  return (
    <div
      className={cx('SingleDatePickerInput', openDirection, className, {
        error,
        empty: !value,
      })}
    >
      <SingleDatePicker
        date={value}
        onDateChange={onChange}
        onFocusChange={({ focused }) => setPickerFocused(focused)}
        focused={pickerFocused}
        openDirection={openDirection}
        displayFormat={dateFormat}
        small
        showDefaultInputIcon
        numberOfMonths={1}
        placeholder="Select a date"
        firstDayOfWeek={1}
        hideKeyboardShortcutsPanel
        readOnly
      />
    </div>
  );
};

DatePicker.defaultProps = {
  openDirection: 'up',
};

DatePicker.propTypes = {
  value: PropTypes.shape({}),
  onChange: PropTypes.func,
  className: PropTypes.string,
  openDirection: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
};

export default DatePicker;
