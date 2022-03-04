import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Checkbox, Popup } from 'semantic-ui-react';
import './Duration.scss';

const Duration = ({
  onChange,
  values,
  onCheckRepeat,
  repeat,
  errors,
  canRepeat,
  showHeader,
}) => {
  const [focus, setFocus] = useState(false);
  return (
    <div className="PlanDuration">
      {showHeader && (
        <div>
          <h3>Duration</h3>
          <Popup
            trigger={<i className="far fa-question-circle mb-2" />}
            on="click"
            hoverable
            inverted
          >
            Start tiny to build a habit, and work your way up. Your goal is to
            win by doing what you planned.
            <a
              className="more-popup"
              href="https://www.getmotivatedbuddies.com/duration/"
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
          <Popup
            content="Duration must be in the format of 2h 45m"
            trigger={
              <Input
                name="duration"
                type="text"
                onChange={onChange}
                value={values.duration}
                error={errors.duration}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                placeholder="2h 30m"
              />
            }
            open={errors.duration && focus}
          />
        </div>
      )}
    </div>
  );
};

Duration.defaultProps = {
  showHeader: true,
};

Duration.propTypes = {
  onChange: PropTypes.func,
  values: PropTypes.shape(),
  canRepeat: PropTypes.bool,
  onCheckRepeat: PropTypes.func,
  showHeader: PropTypes.bool,
  errors: PropTypes.shape(),
  repeat: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
};

export default Duration;
