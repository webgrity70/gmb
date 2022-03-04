/* eslint-disable no-restricted-globals */
import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './MatchMeter.scss';

function MatchMeter({ percentage }) {
  const percentageLabel = (() => {
    if (percentage >= 75) return 'Excellent';
    if (percentage >= 50) return 'Great';
    return 'Good';
  })();
  return (
    <div className={cx('MatchMeter', percentageLabel.toLowerCase())}>
      <div className="mx-1 md:ml-2 md:mr-1">
        <div className="MatchMeter__bar" />
        <div className="MatchMeter__bar" />
        <div className="MatchMeter__bar" />
      </div>
      <span>{percentageLabel}</span>
    </div>
  );
}

MatchMeter.propTypes = {
  percentage: PropTypes.number,
};

export default MatchMeter;
