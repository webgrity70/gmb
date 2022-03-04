import React from 'react';
import PropTypes from 'prop-types';

const Circle = ({ value, name, text }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="200"
    width="200"
    viewBox="0 0 200 200"
    data-value={value}
  >
    <path stroke="#E1E1E1" d="M41 149.5a77 77 0 1 1 117.93 0" fill="none" />
    <path
      className={name}
      stroke="#09c"
      d="M41 149.5a77 77 0 1 1 117.93 0"
      fill="none"
      strokeDasharray="360"
      strokeDashoffset="360"
    />
    {text && (
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
        {text}
      </text>
    )}
  </svg>
);

Circle.propTypes = {
  value: PropTypes.number,
  name: PropTypes.string,
  text: PropTypes.string,
};

export default Circle;
