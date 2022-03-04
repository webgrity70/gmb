import React from 'react';
import { Input } from 'semantic-ui-react';
import { TimeInput } from 'semantic-ui-calendar-react';
import { connect } from 'react-redux';
import _ from 'lodash';

import SingleSelect from './SingleSelect';
import { handleChange } from '../../../../Actions/signup';

const SameTimeAndPlace = ({
  value,
  onChange,
  options,
  selectedDays,
  handleChange,
}) => {
  value = value || { time: '', place: '' };

  // plan_days
  const updateDaysValue = () => {
    const planDays = {};
    _.forEach(selectedDays, (day) => {
      planDays[day] = {
        time: value.time,
        place: value.place,
      };
    });
    handleChange(planDays, 'plan_days');
  };

  const onPlaceChange = (e, data) => {
    value.place = data.value;
    onChange(value);
    updateDaysValue();
  };
  const onTimeChange = (time) => {
    value.time = time;
    onChange(value);
    updateDaysValue();
  };

  const onSelectChange = (val) => {
    value.value = val;
    onChange(value);
  };
  const { time, place } = value;
  return (
    <div className="same-time-and-place">
      <div className="selector" style={{ textAlign: 'center' }}>
        <SingleSelect
          value={value.value}
          onChange={onSelectChange}
          options={options}
        />
      </div>

      {value.value === 'Yes' && (
        <div className="same-inputs">
          <TimeInput
            className="timeInput"
            name="time"
            placeholder="00:00 AM"
            timeFormat="AMPM"
            iconPosition="left"
            value={time}
            onChange={(e, { value }) => onTimeChange(value)}
          />
          <Input value={place} placeholder="Place" onChange={onPlaceChange} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedDays: state.signup.values.plan_days_of_week,
});

export default connect(mapStateToProps, { handleChange })(SameTimeAndPlace);
