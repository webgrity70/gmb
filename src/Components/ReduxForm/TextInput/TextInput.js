import React from 'react';
import cx from 'classnames';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import FieldSetLayout from '../FieldSetLayout';
import './TextInput.scss';

export function InputComp({ className, onChange, value, ...props }) {
  return (
    <input
      className={cx('TextInput', className)}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  );
}

InputComp.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  onChange: PropTypes.func,
  value: PropTypes.string,
};

function InnerComp({
  input,
  type,
  autoCapitalize,
  placeholder,
  required,
  className,
  ...props
}) {
  return (
    <FieldSetLayout {...props}>
      <InputComp
        className={className}
        placeholder={placeholder}
        required={required}
        type={type}
        autoCapitalize={autoCapitalize}
        {...input}
      />
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  type: PropTypes.string,
  autoCapitalize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

InnerComp.defaultProps = {
  type: 'text',
  autoCapitalize: 'true',
};

const TextInput = (props) => <Field {...props} component={InnerComp} />;

export default TextInput;
