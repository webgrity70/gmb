import React from 'react';
import BEMHelper from 'react-bem-helper';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import {
  getUserPreferences,
  getUserMeasurementUnit,
} from '../../../../selectors/profile';
import './PreferencesModuleInfo.scss';

const types = {
  IN_PERSON: 'In Person',
  VIRTUAL: 'Virtual',
};

const bem = BEMHelper({
  name: 'ProfilePreferencesModuleInfo',
  outputIsString: true,
});

const PreferencesModuleInfo = (props) => {
  const {
    sex,
    timezone,
    age,
    radiusKm,
    measurementUnit,
    className,
    meetingPreference,
  } = props;
  const timezoneValue = timezone != null ? `±${timezone} hrs` : undefined;
  const ageValue = age != null ? age.replace(',', '-') : undefined;

  let radiusValue = radiusKm != null ? `${Math.round(radiusKm)} km` : undefined;
  if (radiusKm != null && measurementUnit === 'Imperial') {
    const mileRadius = Math.round(radiusKm * 0.6214);
    radiusValue = `${mileRadius} mi`;
  }
  const meetingValue =
    meetingPreference != null ? meetingPreference.join(', ') : undefined;
  const onlyInPerson =
    meetingPreference &&
    meetingPreference.length === 1 &&
    meetingPreference[0] === types.IN_PERSON;
  const onlyVirtual =
    meetingPreference &&
    meetingPreference.length === 1 &&
    meetingPreference[0] === types.VIRTUAL;
  return (
    <div className={cx(bem(), className, 'px-2')}>
      <Grid>
        <Grid.Column width={8}>
          <PreferenceItem name="Gender" value={sex} />
        </Grid.Column>
        {!onlyInPerson && (
          <Grid.Column width={8}>
            <PreferenceItem name="Timezone" value={timezoneValue} />
          </Grid.Column>
        )}
        <Grid.Column width={8}>
          <PreferenceItem name="Age" value={ageValue} />
        </Grid.Column>
        {!onlyVirtual && (
          <Grid.Column width={8}>
            <PreferenceItem name="Distance" value={radiusValue} />
          </Grid.Column>
        )}
        <Grid.Column width={16}>
          <PreferenceItem name="Meeting Preference" value={meetingValue} />
        </Grid.Column>
      </Grid>
    </div>
  );
};

PreferencesModuleInfo.propTypes = {
  radiusKm: PropTypes.number,
  sex: PropTypes.string,
  timezone: PropTypes.number,
  age: PropTypes.string,
  measurementUnit: PropTypes.string,
  meetingPreference: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

function PreferenceItem({ name, value }) {
  return (
    <div>
      <span>{name}:</span>
      <strong className="ml-2">{value != null ? value : 'None'}</strong>
    </div>
  );
}

PreferenceItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
};

const mapStateToProps = (state, props) => {
  const preferences = getUserPreferences(state, props) || {};
  return {
    sex: preferences.buddySex,
    timezone: preferences.buddyTimezone,
    age: preferences.buddyAge,
    radiusKm: preferences.buddyRadius,
    meetingPreference: preferences.meetingPreference,
    measurementUnit: getUserMeasurementUnit(state, props),
  };
};

const ConnectedPreferencesModuleInfo = connect(
  mapStateToProps,
  {}
)(PreferencesModuleInfo);

ConnectedPreferencesModuleInfo.propTypes = {
  profileId: PropTypes.string,
};

export default ConnectedPreferencesModuleInfo;
