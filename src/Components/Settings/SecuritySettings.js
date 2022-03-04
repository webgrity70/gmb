import React from 'react';
import * as PropTypes from 'prop-types';
import { AccountBlock, LoginHistoryBlock, PasswordBlock } from './components';

const propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    name: PropTypes.string,
    date_of_birth: PropTypes.string,
    phone_number: PropTypes.string,
    google: PropTypes.string,
    facebook: PropTypes.string,
  }).isRequired,
};

const SecuritySettings = (props) => (
  <React.Fragment>
    <PasswordBlock title="Password" editable {...props} />
    <AccountBlock title="Account" editable {...props} />
    <LoginHistoryBlock title="Login History" {...props} />
  </React.Fragment>
);

SecuritySettings.propTypes = propTypes;

export default SecuritySettings;
