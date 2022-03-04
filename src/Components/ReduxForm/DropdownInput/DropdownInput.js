import React from 'react';
import cx from 'classnames';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { Dropdown, Button, Icon } from 'semantic-ui-react';
import FieldSetLayout from '../FieldSetLayout';
import './DropdownInput.scss';

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
  input: { onChange, onBlur, value },
  options,
  placeholder,
  ...props
}) {
  const result = options.find((e) => e.value === value);
  return (
    <FieldSetLayout {...props}>
      <Dropdown
        fluid
        options={options}
        icon={null}
        value={value}
        onClick={() => onBlur()}
        className="DropdownInput"
        onChange={(e, { value: val }) => onChange(val)}
        trigger={
          <Button basic>
            <div className={cx({ placeholder: !result || !result.text })}>
              {result ? result.text : placeholder}
            </div>
            <Icon name="triangle down" />
          </Button>
        }
      />
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  options: PropTypes.arrayOf(PropTypes.shape()),
};

const DropdownInput = (props) => <Field {...props} component={InnerComp} />;

export default DropdownInput;
