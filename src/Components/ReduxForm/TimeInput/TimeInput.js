import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { Field } from 'redux-form';
import { Input } from '../TextInput';
import FieldSetLayout from '../FieldSetLayout';
import { getMinutesOptions, getFormatOptions, getHourOptions } from './utils';
import './TimeInput.scss';

function InnerComp({ input: { value, onChange, onBlur }, disabled, ...props }) {
  const [openHours, setOpenHours] = useState(false);
  const [openFormat, setOpenFormat] = useState(false);
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
  function onSelectFormat(e, { value: val }) {
    onSelect(val, 'format');
    setOpenFormat(false);
  }
  function onChangeHourInput(val) {
    onChange({ ...value, hours: val });
  }
  function onChangeMinutesInput(val) {
    onChange({ ...value, minutes: val });
  }
  function onChangeFormatInput(val) {
    onChange({ ...value, format: val });
  }
  function onBlurMinutes() {
    if (value.minutes && value.minutes.length === 1)
      onChangeMinutesInput(`0${value.minutes}`);
    setOpenMinutes(false);
  }
  const hourOptions = getHourOptions(onSelectHours, value.hours, !value.format);
  const minutesOptions = getMinutesOptions(onSelectMinutes, value.minutes);
  const formatOptions = getFormatOptions(onSelectFormat);

  return (
    <FieldSetLayout {...props}>
      <div className="flex">
        <Dropdown
          fluid
          options={hourOptions}
          icon={null}
          onClick={() => onBlur()}
          onBlur={() => setOpenHours(false)}
          className="TimeInput"
          value={value.hours}
          open={openHours}
          trigger={
            <Input
              disabled={disabled}
              value={value.hours}
              onChange={onChangeHourInput}
              onFocus={() => setOpenHours(true)}
              tabindex={props.tabindexbase}
            />
          }
        />

        <span className="flex items-center ml-1">:</span>

        <Dropdown
          fluid
          options={minutesOptions}
          icon={null}
          value={value.minutes}
          onClick={() => onBlur()}
          onBlur={onBlurMinutes}
          open={openMinutes}
          className="TimeInput ml-2"
          trigger={
            <Input
              disabled={disabled}
              value={value.minutes}
              onChange={onChangeMinutesInput}
              onFocus={() => setOpenMinutes(true)}
              tabindex={props.tabindexbase + 1}
            />
          }
        />
        {Object.prototype.hasOwnProperty.call(value, 'format') && (
          <Dropdown
            fluid
            options={formatOptions}
            icon={null}
            value={value.format ? value.format.toLowerCase() : null}
            onClick={() => onBlur()}
            onBlur={() => setOpenFormat(false)}
            open={openFormat}
            className="TimeInput ml-2"
            trigger={
              <Input
                disabled={disabled}
                value={value.format}
                onChange={onChangeFormatInput}
                onFocus={() => setOpenFormat(true)}
                tabindex={props.tabindexbase + 2}
              />
            }
          />
        )}
      </div>
    </FieldSetLayout>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf([null])]),
};

const TimeInput = (props) => <Field {...props} component={InnerComp} />;

export default TimeInput;
