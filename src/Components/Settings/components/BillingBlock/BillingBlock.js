import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { createSelector } from 'redux-starter-kit';
import cx from 'classnames';
import BEMHelper from 'react-bem-helper';
import { Header, Segment } from 'semantic-ui-react';
import {
  getUserHasPlan,
  getUserSubscription,
} from '../../../../reducers/session/selectors';
import SettingsProperty from '../../SettingsProperty';

import './BillingBlock.scss';

const bem = BEMHelper({ name: 'SettingsBillingBlock', outputIsString: true });

function BillingBlock(props) {
  const {
    title,
    nextBillingAt,
    billingPeriodUnit,
    billingPeriod,
    hasPlan,
  } = props;

  return (
    <Segment fluid className={cx('settings-block', bem())}>
      <Header as="h2" className="settings-block-title">
        {title}
      </Header>
      {hasPlan && nextBillingAt && (
        <SettingsProperty
          name="Next Billing On"
          value={moment(nextBillingAt).format('MMM D, YYYY')}
        />
      )}
      {hasPlan && billingPeriod != null && billingPeriodUnit && (
        <SettingsProperty
          name="Billing Period"
          value={
            billingPeriod > 1
              ? `Every ${billingPeriod} ${billingPeriodUnit}s`
              : `Every ${billingPeriodUnit}`
          }
        />
      )}
    </Segment>
  );
}

BillingBlock.propTypes = {
  title: PropTypes.string.isRequired,
  nextBillingAt: PropTypes.string,
  billingPeriod: PropTypes.number,
  billingPeriodUnit: PropTypes.string,
  hasPlan: PropTypes.bool.isRequired,
};

const mapStateToProps = createSelector(
  [getUserSubscription, getUserHasPlan],
  (subscription = {}, hasPlan) => ({
    hasPlan,
    billingPeriod: subscription.billingPeriod,
    billingPeriodUnit: subscription.billingPeriodUnit,
    nextBillingAt: subscription.nextBillingAt,
  })
);

export default connect(mapStateToProps)(BillingBlock);
