import React from 'react';
import * as PropTypes from 'prop-types';
import { BillingBlock, MembershipBlock } from './components';

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

class SubscriptionsSettings extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MembershipBlock title="Membership" {...this.props} />
        <BillingBlock title="Billing" {...this.props} />
      </React.Fragment>
    );
  }
}

SubscriptionsSettings.propTypes = propTypes;

export default SubscriptionsSettings;
