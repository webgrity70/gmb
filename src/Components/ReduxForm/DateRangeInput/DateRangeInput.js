import React, { useState } from 'react';
import { Field, change } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';
import { DateRangePicker } from 'react-dates';
import FieldSetLayout from '../FieldSetLayout';
import { convertEventsToWeeksForm } from '../../NewPlan/utils';

import './DateRangeInput.scss';

function InnerComp({
  input,
  openDirection,
  numberOfMonths,
  restrictRange,
  maxDate,
  minDate,
  details,
  changeFormValue,
  formName,
  ...props
}) {
  const { onChange, name, value } = input;
  const [pickerFocused, setPickerFocused] = useState(null);
  function evalIsOutsidRange(day) {
    const today = moment();
    const date = day.isSame(today, 'day')
      ? day.set({ hours: 23, minutes: 59 })
      : day;
    if (date.isBefore(moment())) return true;
    if (minDate && day.isBefore(minDate)) return true;
    if (restrictRange) {
      const maxCalculatedDate =
        !maxDate && value.startDate
          ? value.startDate.clone().add(11, 'weeks')
          : null;
      const maxDateCond = maxDate && date.isAfter(maxDate);
      const maxCalculatedCond =
        maxCalculatedDate && date.isAfter(maxCalculatedDate);
      if (maxDateCond || maxCalculatedCond) {
        return true;
      }
      return false;
    }
    return false;
  }

  const handleChange = (e) => {
    onChange(e);
    if (details) {
      const eventdate = details.timezone
        ? moment(details.events[0].date).tz(details.timezone)
        : moment(details.events[0].date);

      const eventTime = eventdate.clone().format('HH:mm');
      const [hour, minute] = eventTime.split(':').map((e) => Number(e));

      let startDay = e.startDate.clone().set({ hour, minute });

      let firstEventDay = moment(details.events[0].date);
      let diff = startDay.diff(firstEventDay, 'days');

      let updated_events = [];
      if (details.events && details.events.length > 0) {
        updated_events = details.events.map((event) => {
          return {
            ...event,
            date: moment(event.date).clone().add(diff, 'days').utc().format(),
          };
        });
      }

      const events = convertEventsToWeeksForm({
        events: updated_events,
        startDate: e.startDate,
      });

      changeFormValue(formName, 'events', events);
    }
  };

  return (
    <FieldSetLayout {...props}>
      <div
        className={cx(
          'DateRangeInput',
          `DateRangeInput__${openDirection.toLowerCase()}`
        )}
      >
        <DateRangePicker
          startDate={value ? value.startDate : null}
          startDateId={`${name}-start-date`}
          endDate={value ? value.endDate : null}
          endDateId={`${name}-end-date`}
          onDatesChange={handleChange}
          onFocusChange={(focused) => setPickerFocused(focused)}
          focusedInput={pickerFocused}
          openDirection={openDirection}
          numberOfMonths={numberOfMonths}
          isOutsideRange={evalIsOutsidRange}
        />
      </div>
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  openDirection: PropTypes.string,
  numberOfMonths: PropTypes.number,
  maxDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  minDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.oneOf([null])]),
  restrictRange: PropTypes.bool,
  formName: PropTypes.string,
};

InnerComp.defaultProps = {
  restrictRange: true,
  openDirection: 'down',
  numberOfMonths: 2,
};

const DateRangeInput = (props) => <Field {...props} component={InnerComp} />;

export default compose(
  connect(null, {
    changeFormValue: change,
  })
)(DateRangeInput);
