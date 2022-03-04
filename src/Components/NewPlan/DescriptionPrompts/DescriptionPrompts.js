/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Field } from 'redux-form';
import BEMHelper from 'react-bem-helper';
import MDEEditor from '../../Elements/MDEditor/MdeEditor';
import FieldSetLayout from '../../ReduxForm/FieldSetLayout';
import './DescriptionPrompts.scss';

const bem = BEMHelper({ name: 'DescriptionPrompts', outputIsString: true });

function InnerComp({ input: { onChange, value }, className, meta, ...props }) {
  return (
    <FieldSetLayout meta={meta}>
      <div className={cx(bem(), className)}>
        <MDEEditor
          value={value}
          onChange={(description) => onChange(description)}
          {...props}
        />
      </div>
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  className: PropTypes.string,
  meta: PropTypes.shape(),
};

const DescriptionPrompts = (props) => (
  <Field {...props} component={InnerComp} />
);

export default DescriptionPrompts;
