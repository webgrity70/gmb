import React from 'react';
import PropTypes from 'prop-types';
import './FormError.scss';

function FormError({ touched, error, warning }) {
  if (touched) {
    if (error) return <p className="FormError">{error}</p>;
    if (warning) return <p className="warning">{warning}</p>;
    return null;
  }
  return null;
}

FormError.propTypes = {
  touched: PropTypes.bool,
  error: PropTypes.string,
  warning: PropTypes.string,
};

export default FormError;
