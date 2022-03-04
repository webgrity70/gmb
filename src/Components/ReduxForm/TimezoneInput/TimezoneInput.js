/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Modal, Button, Popup } from 'semantic-ui-react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import FieldSetLayout from '../FieldSetLayout';
import { RadioOptions } from '../RadioInput/RadioInput';
import './TimezoneInput.scss';

const bem = BEMHelper({ name: 'TimezoneInput', outputIsString: true });

const options = [
  {
    label: 'Universal Time',
    value: 'Global',
    text: 'Universal, the date and time are the same everywhere in the world',
    description: () => (
      <div className={bem('description')}>
        <span>
          Universal Time means an event happens at a universal time around the
          world.
        </span>
        <span className="mt-8">
          e.g., If you’re in California and your event starts at 9AM PST, it
          starts for someone in New York at 12PM EST.
        </span>
      </div>
    ),
  },
  {
    label: "User's Local Timezone",
    value: 'User Local Timezone',
    text: 'User Local Timezone',
    description: () => (
      <div className={bem('description')}>
        <span>User's Local Timezone.</span>
        <span className="mt-8">
          e.g., If you’re in California and your event starts at 9AM PST, it
          starts for someone in New York at 9AM EST.
        </span>
      </div>
    ),
  },
];

function InnerComp({ input: { value, onChange }, ...props }) {
  const [_value, setValue] = useState(value);
  const [isTimezoneModalOpen, setTimezoneModalOpen] = useState(false);
  const currentValObj = options.find((opt) => opt.value === _value);
  function onSave() {
    if (_value !== value) onChange(_value);
    setTimezoneModalOpen(false);
  }
  return (
    <>
      <FieldSetLayout {...props}>
        <div className={bem()}>
          <span>Timezone settings: </span>
          <span className={bem('value')}>
            {currentValObj.text}
            <Popup
              trigger={<i className="far fa-question-circle mt-2 ml-3" />}
              on="click"
              inverted
              hoverable
            >
              Choose whether participants do events at the exact same time
              anywhere in the world, or at the planned time in their timezones.
            </Popup>
          </span>
          <a onClick={() => setTimezoneModalOpen(true)}>Edit</a>
        </div>
      </FieldSetLayout>
      <Modal
        dimmer="inverted"
        size="small"
        closeIcon={{ name: 'close', color: 'grey' }}
        open={isTimezoneModalOpen}
        closeOnDimmerClick={false}
        onClose={() => setTimezoneModalOpen(false)}
        className={bem('modal')}
      >
        <Modal.Header className="text-center">Timezone Settings</Modal.Header>
        <Modal.Content>
          <div>
            <RadioOptions
              options={options}
              value={_value}
              onChange={(val) => setValue(val)}
            />
            {currentValObj.description()}
          </div>
        </Modal.Content>
        <Modal.Actions className="justify-end">
          <Button color="orange" onClick={onSave}>
            Cancel
          </Button>
          <Button color="orange" onClick={onSave}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
}

InnerComp.propTypes = {
  input: PropTypes.shape(),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

const TimezoneInput = (props) => <Field {...props} component={InnerComp} />;

export default TimezoneInput;
