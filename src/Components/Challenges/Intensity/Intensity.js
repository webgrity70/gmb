import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './Intensity.scss';

function Intensity({ intensity, noText = false }) {
  return (
    <div className="ChallengeIntensity">
      <div>
        <div className="active" />
        <div
          className={cx({ active: ['Hard', 'Medium'].includes(intensity) })}
        />
        <div className={cx({ active: intensity === 'Hard' })} />
      </div>
      {!noText ? intensity : ''}
    </div>
  );
}

Intensity.propTypes = {
  intensity: PropTypes.oneOf(['Easy', 'Medium', 'Hard']),
};

export default Intensity;
