import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field } from 'redux-form';
import { Checkbox } from 'semantic-ui-react';
import FieldSetLayout from '../FieldSetLayout';
import './CheckBoxInput.scss';

export function CheckBoxComp({
  onChange,
  value,
  label,
  name,
  className,
  onClick,
  disabled,
  ...props
}) {
  function onKeyPress(e) {
    const enterPressed = e.which === 13 || e.keyCode === 13;
    if (enterPressed) onChange(Boolean(!value));
  }
  return (
    <Checkbox
      label={label}
      name={name}
      checked={value}
      disabled={disabled}
      onChange={() => onChange(Boolean(!value))}
      className={cx('CheckBoxInput', className)}
      onKeyPress={onKeyPress}
      onClick={onClick}
      {...props}
    />
  );
}
CheckBoxComp.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  label: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  name: PropTypes.string,
  onClick: PropTypes.func,
};

function InnerComp({
  input: { name, onChange, value },
  label,
  onClick,
  disabled,
  ...props
}) {
  return (
    <FieldSetLayout {...props}>
      <CheckBoxComp
        label={label}
        name={name}
        value={value}
        disabled={disabled}
        onChange={() => onChange(Boolean(!value))}
        onClick={onClick}
      />
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  label: PropTypes.string,
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  onClick: PropTypes.func,
};

const CheckBoxInput = (props) => <Field {...props} component={InnerComp} />;

export default CheckBoxInput;
