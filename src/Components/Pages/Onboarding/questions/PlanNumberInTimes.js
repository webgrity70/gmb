import React from 'react';
import { Input, Dropdown } from 'semantic-ui-react';
import { handleChange } from '../../../../Actions/signup';

const DURATION_OPTIONS = [
  { value: 'm', key: 'm', text: 'minutes' },
  { value: 'h', key: 'h', text: 'hours' },
];

const PlanNumberOfTimes = ({ value, onChange }) => {
  value = value || { times: '', duration: '', durationOption: 'm' };
  const onTimesChange = (val) => {
    value.times = val;
    onChange(value);
  };

  const onDurationChange = (duration, option) => {
    value.duration = duration;
    value.option = option;
    onChange(value);
    handleChange(`${duration} ${option}`, 'plan_session_duration');
  };

  const { option, times, duration } = value;

  return (
    <React.Fragment>
      <Input
        value={times}
        onChange={(e, data) => onTimesChange(data.value)}
        min="1"
        max="7"
        type="number"
        maxLength={1}
      />
      <span className="sub-title"> times per week for </span>
      <Input
        value={duration}
        onChange={(e, data) => onDurationChange(data.value, option || 'm')}
        type="number"
      />
      <Dropdown
        inline
        options={DURATION_OPTIONS}
        defaultValue={option || 'm'}
        onChange={(e, data) => onDurationChange(duration, data.value)}
      />
    </React.Fragment>
  );
};

export default PlanNumberOfTimes;
