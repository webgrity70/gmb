import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { Field } from 'redux-form';
import { Input } from '../TextInput';
import FieldSetLayout from '../FieldSetLayout';
import { getHourOptions, getMinutesOptions } from './utils';
import './DurationInput.scss';

function InnerComp({ input: { value, onChange, onBlur }, disabled, ...props }) {
  const [openHours, setOpenHours] = useState(false);
  const [openMinutes, setOpenMinutes] = useState(false);
  function onSelect(val, prop) {
    if (val) onChange({ ...value, [prop]: val });
  }
  function onSelectHours(e, { value: val }) {
    onSelect(val, 'hours');
    setOpenHours(false);
  }
  function onSelectMinutes(e, { value: val }) {
    onSelect(val, 'minutes');
    setOpenMinutes(false);
  }
  function onChangeHourInput(val) {
    onChange({ ...value, hours: val });
  }
  function onChangeMinutesInput(val) {
    onChange({ ...value, minutes: val });
  }
  const hourOptions = getHourOptions(onSelectHours, value.hours);
  const minutesOptions = getMinutesOptions(onSelectMinutes, value.minutes);
  return (
    <FieldSetLayout {...props}>
      <div className="flex">
        <Dropdown
          fluid
          options={hourOptions}
          icon={null}
          value={value.hours}
          onClick={() => onBlur()}
          onBlur={() => setOpenHours(false)}
          className="DurationInput"
          open={openHours}
          trigger={
            <>
              <Input
                disabled={disabled}
                value={value.hours}
                onChange={onChangeHourInput}
                onFocus={() => setOpenHours(true)}
                tabindex={props.tabindexbase}
              />
              <span className="DurationInput__label">hr</span>
            </>
          }
        />
        <Dropdown
          fluid
          options={minutesOptions}
          icon={null}
          value={value.minutes}
          onClick={() => onBlur()}
          className="DurationInput ml-2"
          onBlur={() => setOpenMinutes(false)}
          open={openMinutes}
          trigger={
            <>
              <Input
                disabled={disabled}
                value={value.minutes}
                onChange={onChangeMinutesInput}
                onFocus={() => setOpenMinutes(true)}
                tabindex={props.tabindexbase + 1}
              />
              <span className="DurationInput__label">min</span>
            </>
          }
        />
      </div>
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
};

const DurationInput = (props) => <Field {...props} component={InnerComp} />;

export default DurationInput;
