import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import InputRange from 'react-input-range';

const TimezoneRange = ({
  min = 0,
  max = 24,
  value,
  step = 1,
  onChange,
  className,
}) => (
  <div className={`slider_container ${className}`}>
    <Form.Field className="form_field_container_inner slider">
      <InputRange
        maxValue={max}
        minValue={min}
        value={value || 0}
        step={step}
        onChange={onChange}
        formatLabel={(hours) => `± ${hours} hours from me.`}
      />
    </Form.Field>
  </div>
);

TimezoneRange.propTypes = {
  className: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  step: PropTypes.number,
  value: PropTypes.number,
};

export default TimezoneRange;
