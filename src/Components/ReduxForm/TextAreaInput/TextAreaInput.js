import React from 'react';
import { Field } from 'redux-form';
import TextareaAutosize from 'react-autosize-textarea';
import PropTypes from 'prop-types';
import FieldSetLayout from '../FieldSetLayout';
import './TextAreaInput.scss';

function InnerComp({
  input: { onChange, value, ...inpuProps },
  placeholder,
  ...props
}) {
  return (
    <FieldSetLayout {...props}>
      <TextareaAutosize
        value={value}
        placeholder={placeholder}
        className="TextAreaInput"
        onChange={(e) => onChange(e.target.value)}
        {...inpuProps}
      />
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

const TextAreaInput = (props) => <Field {...props} component={InnerComp} />;

export default TextAreaInput;
