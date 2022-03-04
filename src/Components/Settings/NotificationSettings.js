import React from 'react';
import * as PropTypes from 'prop-types';
import { NotificationsBlock, SettingsBlock } from './components';
import phoneNumberRegex from '../../utils/phoneNumberRegex';

const propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    name: PropTypes.string,
    date_of_birth: PropTypes.string,
    phone_number: PropTypes.string,
    phone_number_verified: PropTypes.bool,
    email: PropTypes.string,
    google: PropTypes.string,
    facebook: PropTypes.string,
  }).isRequired,
};

const NotificationSettings = ({ user, ...props }) => {
  const contactInformation = [
    {
      label: 'Email',
      value: user.email,
      key: 'email',
      single: true,
      verified: true,
    },
    {
      label: 'Phone number',
      value: user.phone_number,
      key: 'phone_number',
      type: 'phone',
      single: true,
      verified: user && !!user.phone_number_verified,
    },
  ];
  function getIsValid(val) {
    return phoneNumberRegex.test(val[1].value);
  }
  return (
    <React.Fragment>
      <SettingsBlock
        title="Contact information"
        settings={contactInformation}
        editable
        user={user}
        isValid={getIsValid}
        {...props}
      />
      <NotificationsBlock title="Notifications" user={user} {...props} />
    </React.Fragment>
  );
};

NotificationSettings.propTypes = propTypes;

export default NotificationSettings;
