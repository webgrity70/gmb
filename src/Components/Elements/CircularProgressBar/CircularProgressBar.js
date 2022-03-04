import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';

import './CircularProgressBar.scss';

const CircularProgressBar = ({
  sqSize = 250,
  points = 0,
  strokeWidth = 9,
  children,
  maxPoints = 1,
  nextLevel = '',
  strokeColor,
}) => {
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  const dashArray = radius * Math.PI * 2;
  const percentage = (points * 100) / maxPoints;
  const dashOffset = dashArray - (dashArray * percentage) / 100;

  const text = (
    <div>
      <p>
        Next Level: <b> {nextLevel} </b>
      </p>
      <p>
        {points}/<b>{maxPoints}</b>
      </p>
    </div>
  );

  return (
    <div className="CircularProgressBar">
      <div
        className="CircularProgressBar__content"
        style={{ width: sqSize, height: sqSize, stroke: strokeColor }}
      >
        <Tooltip
          placement="right"
          overlay={text}
          overlayClassName="CircularProgressBar__tooltip"
        >
          <svg width={sqSize} height={sqSize} viewBox={viewBox}>
            <circle
              className="CircularProgressBar__content-background"
              cx={sqSize / 2}
              cy={sqSize / 2}
              r={radius}
              strokeWidth={`${strokeWidth}px`}
            />
            <circle
              className="CircularProgressBar__content-progress"
              cx={sqSize / 2}
              cy={sqSize / 2}
              r={radius}
              strokeWidth={`${strokeWidth}px`}
              // Start progress marker at 12 O'Clock
              transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
              style={{
                strokeDasharray: dashArray,
                strokeDashoffset: dashOffset,
              }}
            />
          </svg>
        </Tooltip>
      </div>
      <div className="CircularProgressBar__children">{children}</div>
    </div>
  );
};

CircularProgressBar.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  maxPoints: PropTypes.number,
  nextLevel: PropTypes.string,
  points: PropTypes.number,
  sqSize: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeWidth: PropTypes.number,
};

export default CircularProgressBar;
