import React from 'react';
import PropTypes from 'prop-types';

function Counter(props) {
  const { minutes, seconds, showOnlyHours } = props;
  let { hours, days } = props;

  function getData(amount, letter) {
    if (amount > 0) {
      return `${amount}${letter}`;
    }
    return '';
  }

  if (showOnlyHours) {
    hours = parseInt(hours, 10) + days * 24;
    days = 0;
  }

  return (
    <span>{`${getData(days, 'd')} ${getData(
      hours,
      'h'
    )} ${minutes}m ${seconds}s`}</span>
  );
}

Counter.propTypes = {
  days: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minutes: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  seconds: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showOnlyHours: PropTypes.bool,
};

export default Counter;
