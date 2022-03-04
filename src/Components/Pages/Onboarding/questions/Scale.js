import React from 'react';
import { Form } from 'semantic-ui-react';
import InputRange from 'react-input-range';

const Scale = ({
  minLabel,
  maxLabel,
  min = 1,
  max = 100,
  value,
  step = 1,
  onChange,
  className,
}) => (
  <div className={`slider_container ${className}`}>
    <div className="slider_labels">
      <Form.Field className="form_field_container_inner_title">
        <span
          className="question_subtitle v2"
          style={{ opacity: 1.2 - (value / max || 0) }}
        >
          {minLabel}
        </span>
      </Form.Field>
      <Form.Field className="form_field_container_inner_title">
        <span
          className="question_subtitle v2"
          style={{ opacity: value / max + 0.2 }}
        >
          {maxLabel}
        </span>
      </Form.Field>
    </div>
    <Form.Field className="form_field_container_inner slider">
      <InputRange
        maxValue={parseInt(max, 10)}
        minValue={parseInt(min, 10)}
        value={value || 0}
        step={step}
        onChange={onChange}
      />
    </Form.Field>
  </div>
);

export default Scale;
