/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import { Radio } from 'semantic-ui-react';
import { Field } from 'redux-form';
import FieldSetLayout from '../FieldSetLayout';
import './RadioInput.scss';

export function RadioOptions({ options, value, onChange, name }) {
  return (
    <ul className="RadioInput">
      {options.map((op) => (
        <li key={`${name}-${op.value}`}>
          <Radio
            label={
              <label>
                {op.label}
                {op.children && op.children}
              </label>
            }
            value={op.value}
            checked={op.value === value}
            onChange={(e, { value: val }) => onChange(val)}
          />
        </li>
      ))}
    </ul>
  );
}
RadioOptions.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape()),
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
};

function InnerComp({ options, input: { value, name, onChange }, ...props }) {
  return (
    <FieldSetLayout {...props}>
      <RadioOptions
        options={options}
        value={value}
        onChange={onChange}
        name={name}
      />
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape()),
  input: PropTypes.shape(),
};

const RadioInput = (props) => <Field {...props} component={InnerComp} />;

export default RadioInput;
