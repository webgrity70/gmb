import React from 'react';
import _ from 'lodash';
import { Form, Radio } from 'semantic-ui-react';

const SingleSelect = ({ value, onChange, options }) => {
  options = _.map(options, (option) => {
    const text = option.text || option.label;
    return {
      value: text,
      text,
    };
  });

  return (
    <div className="single-select">
      {_.map(options, (option, index) => (
        <Form.Field key={`select-${index}`}>
          <Radio
            label={option.text}
            value={option.value}
            onChange={(e, { value }) => onChange(value)}
            checked={value === option.value}
          />
        </Form.Field>
      ))}
    </div>
  );
};

export default SingleSelect;
