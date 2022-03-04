import React, { useState } from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import { SingleDatePicker } from 'react-dates';
import FieldSetLayout from '../FieldSetLayout';
import './SingleDateInput.scss';

function InnerComp({
  input,
  openDirection,
  restrictRange,
  disabled,
  maxDate,
  minDate,
  ...props
}) {
  const { onChange, value } = input;
  const [pickerFocused, setPickerFocused] = useState(false);
  function evalIsOutsidRange(day) {
    const today = moment();
    const date = day.isSame(today, 'day')
      ? day.set({ hours: 23, minutes: 59 })
      : day;
    if (date.isBefore(moment())) return true;
    if (minDate && day.isBefore(minDate)) return true;
    if (restrictRange) {
      const maxCalculatedDate =
        !maxDate && value ? value.clone().add(12, 'weeks') : null;
      const maxDateCond = maxDate && date.isAfter(maxDate, 'day');
      const maxCalculatedCond =
        maxCalculatedDate && date.isAfter(maxCalculatedDate);
      if (maxDateCond || maxCalculatedCond) {
        return true;
      }
      return false;
    }
    return false;
  }
  return (
    <FieldSetLayout {...props}>
      <div
        className={cx(
          'SingleDateInput',
          `SingleDateInput__${openDirection.toLowerCase()}`
        )}
      >
        <SingleDatePicker
          onDateChange={onChange}
          disabled={disabled}
          onFocusChange={({ focused }) => setPickerFocused(focused)}
          focused={pickerFocused}
          openDirection={openDirection}
          numberOfMonths={1}
          isOutsideRange={evalIsOutsidRange}
          {...(value && { date: value })}
        />
      </div>
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  openDirection: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  maxDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  minDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  restrictRange: PropTypes.bool,
};

InnerComp.defaultProps = {
  restrictRange: true,
  openDirection: 'down',
};

const DateInput = (props) => <Field {...props} component={InnerComp} />;

export default DateInput;
