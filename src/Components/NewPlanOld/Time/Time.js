import React, { useState, useEffect, Fragment } from 'react';
import { Checkbox, Popup, Input } from 'semantic-ui-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import parseTime from './parseTime';
import './Time.scss';

const Time = ({
  onChange,
  error,
  value,
  showHeader,
  onCheckRepeat,
  repeat,
  disabled,
  canRepeat,
  pastDay,
  timeFormat,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [focus, setFocus] = useState(false);
  function getValue() {
    if (!value) return value;
    const [hours, minutes] = value.split(':');
    if (!minutes && !!value) return '';
    return moment().set({ hours, minutes }).format(timeFormat);
  }
  useEffect(() => {
    const formated = getValue();
    setInputValue(formated);
  }, [value]);
  function formatAndChange(val) {
    const date = parseTime(val);
    if (typeof date !== 'object') onChange('');
    else {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formatedValue = moment().set({ hours, minutes }).format('HH:mm');
      onChange(formatedValue);
    }
  }
  function onChangeValue(_, { value: val }) {
    setInputValue(val);
  }
  function onBlur() {
    setFocus(false);
    formatAndChange(inputValue);
  }
  function onFocus() {
    const time = getValue();
    setInputValue(time);
    setFocus(true);
  }
  function checkForEnter(event) {
    if (event.key === 'Enter') formatAndChange(inputValue);
  }

  return (
    <div className="PlanTime">
      {showHeader && (
        <div>
          <h3>Time</h3>
          <Popup
            trigger={<i className="far fa-question-circle mb-2" />}
            on="click"
            hoverable
            inverted
          >
            Choosing a time creates the real commitment. You can always change
            it.
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
        <Fragment>
          <Popup
            content="Type 6am, 6:30pm or 18:30 and press Enter"
            trigger={
              <Input
                name="time"
                type="text"
                onChange={onChangeValue}
                value={inputValue}
                error={error}
                disabled={disabled}
                onFocus={onFocus}
                onKeyDown={checkForEnter}
                onBlur={onBlur}
                placeholder={!error ? 'Select a time' : 'Invalid Time'}
              />
            }
            open={error && focus}
          />
          {pastDay && <span>Past. Change time or date.</span>}
        </Fragment>
      )}
    </div>
  );
};

Time.defaultProps = {
  showHeader: true,
};

Time.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  canRepeat: PropTypes.bool,
  onCheckRepeat: PropTypes.func,
  showHeader: PropTypes.bool,
  timeFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  repeat: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
  pastDay: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
};

export default React.memo(Time);
