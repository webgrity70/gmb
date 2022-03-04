import React from 'react';
import { Form } from 'semantic-ui-react';
import InputRange from 'react-input-range';
import _ from 'lodash';

const RangeSlider = ({ max, min, value, onChange, step = 1 }) => (
  <Form.Field className="form_field_container_inner range">
    <InputRange
      maxValue={parseInt(max, 10)}
      minValue={parseInt(min, 10)}
      value={{
        min: parseInt(_.get(value, '[0]', min), 10),
        max: parseInt(_.get(value, '[1]', max), 10),
      }}
      step={step}
      onChange={(value) => onChange([value.min, value.max])}
    />
  </Form.Field>
);

export default RangeSlider;
