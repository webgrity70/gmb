import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { CheckBoxInput } from '../../ReduxForm';

function AdvancedOptions({ active, disabled }) {
  return (
    <div>
      <div className="flex items-baseline">
        <CheckBoxInput
          name="advanced.active"
          label="Allow members to change the details of the
          challenge according to their preferences."
        />
        <Popup
          trigger={<i className="far fa-question-circle mt-2 mr-2 ml-2" />}
          on="click"
          inverted
          hoverable
        >
          Choose whether the member can change the time, duration, location or
          details to suit their schedule.
        </Popup>
        <span className="option-recommended">Recommended</span>
      </div>

      {active && (
        <div className="ml-8">
          <CheckBoxInput
            name="advanced.time"
            label="Time of each event"
            disabled={disabled}
          />
          <CheckBoxInput name="advanced.specifics" label="Event details" />
          <CheckBoxInput name="advanced.location" label="Location" />
          <CheckBoxInput name="advanced.duration" label="Duration" />
        </div>
      )}
    </div>
  );
}

AdvancedOptions.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

const mapStateToProps = (state, { formName }) => {
  const selector = formValueSelector(formName);
  const { advanced, timezoneRestriction } = selector(
    state,
    'advanced',
    'timezoneRestriction'
  );
  const disabled = timezoneRestriction === 'Global';
  return {
    active: advanced.active,
    disabled,
  };
};

export default connect(mapStateToProps)(AdvancedOptions);
