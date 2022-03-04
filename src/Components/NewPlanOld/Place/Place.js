import React from 'react';
import { Input, Checkbox, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import './Place.scss';

const Place = ({
  onChange,
  value,
  showHeader,
  onCheckRepeat,
  repeat,
  canRepeat,
  error,
}) => (
  <div className="PlaceInput">
    {showHeader && (
      <div>
        <h3>Place</h3>
        <Popup
          trigger={<i className="far fa-question-circle mb-2" />}
          on="click"
          hoverable
          inverted
        >
          Choosing a location allows you to mentally rehearse your behavior.
          <a
            className="more-popup"
            href="https://www.getmotivatedbuddies.com/time-and-place/"
            rel="noopener noreferrer"
            target="_blank"
          >
            more
          </a>
        </Popup>
      </div>
    )}
    {canRepeat && (
      <Checkbox checked={repeat} onChange={onCheckRepeat} label="repeat" />
    )}
    {(repeat === undefined || repeat) && (
      <div>
        <Input
          name="place"
          placeholder="the park"
          onChange={onChange}
          value={value}
          error={error}
          autoCapitalize="none"
        />
      </div>
    )}
  </div>
);

Place.defaultProps = {
  showHeader: true,
};

Place.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  canRepeat: PropTypes.bool,
  onCheckRepeat: PropTypes.func,
  showHeader: PropTypes.bool,
  repeat: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
};

export default Place;
