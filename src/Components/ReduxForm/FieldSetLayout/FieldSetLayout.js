/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import FormError from '../FormError';
import './FieldSetLayout.scss';

function FieldSetLayout({
  label,
  legend,
  meta,
  children,
  required,
  className,
  ...props
}) {
  return (
    <fieldset className={cx('FieldSetLayout m-0', className)} {...props}>
      {label && (
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      {children}
      {legend && <p className="FieldSetLayout__legend">{legend}</p>}
      <FormError {...meta} />
    </fieldset>
  );
}

FieldSetLayout.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.oneOf([null]),
  ]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  legend: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  children: PropTypes.element,
  meta: PropTypes.shape(),
};

export default FieldSetLayout;
