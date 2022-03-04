import React from 'react';
import { connect } from 'react-redux';
import { Form, Input } from 'semantic-ui-react';
import { TimeInput } from 'semantic-ui-calendar-react';
import _ from 'lodash';

const PlanDays = ({ value, onChange, days }) => {
  const onDayTimeChange = (day, val) => {
    value = value || {};
    value[day] = value[day] || {};
    value[day].time = val;
    onChange(value);
  };
  const onPlaceChange = (day, val) => {
    value = value || {};
    value[day] = value[day] || {};
    value[day].place = val;
    onChange(value);
  };
  return (
    <Form.Field className="plan-days">
      <div className="plan-days--container">
        {_.map(days, (day) => (
          <div className="plan_days_block" key={day}>
            <div className="plan_days_day">{day}:</div>
            <div className="plan_days_inputs">
              <TimeInput
                className="timeInput"
                name="time"
                placeholder="00:00 AM"
                timeFormat="AMPM"
                iconPosition="left"
                value={_.get(value, `[${day}].time`, '')}
                onChange={(e, { value }) => onDayTimeChange(day, value)}
              />
            </div>

            <div className="plan_days_location">
              <Input
                value={_.get(value, `[${day}].place`, '')}
                placeholder="Place"
                onChange={(e, { value }) => onPlaceChange(day, value)}
              />
            </div>
          </div>
        ))}
      </div>
    </Form.Field>
  );
};

const mapStateToProps = (state) => ({
  days: state.signup.values.plan_days_of_week,
});

export default connect(mapStateToProps)(PlanDays);
