import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import InputRange from 'react-input-range';

const Distance = ({
  min = 1,
  max = 100,
  value,
  step = 1,
  onChange,
  className,
}) => {
  function formatLabel(miles) {
    const kmValue = Math.round(miles / 0.6214);
    return `${miles}mi (${kmValue}km)`;
  }
  return (
    <div className={`slider_container ${className}`}>
      <Form.Field className="form_field_container_inner slider">
        <InputRange
          maxValue={max}
          minValue={min}
          value={value || 0}
          step={step}
          onChange={onChange}
          formatLabel={formatLabel}
        />
      </Form.Field>
    </div>
  );
};

Distance.propTypes = {
  className: PropTypes.string,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  step: PropTypes.number,
  value: PropTypes.number,
};

export default Distance;
