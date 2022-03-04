import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { createSelector } from 'redux-starter-kit';
import cx from 'classnames';
import { withRouter } from 'react-router-dom';
import BEMHelper from 'react-bem-helper';
import { Header, Segment, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import {
  getUserHasPlan,
  getUserSubscription,
  getDaysLeftOfPlanTrial,
  getCurrentUserId,
} from '../../../../reducers/session/selectors';
import * as billingActions from '../../../../Actions/actions_billing';
import { TrackEvent } from '../../../../Services/TrackEvent';
import SettingsProperty from '../../SettingsProperty';
import * as userActions from '../../../../Actions/actions_user';

import './MembershipBlock.scss';
import { gaEvent } from '../../../../utils/gtm';

const bem = BEMHelper({
  name: 'SettingsMembershipBlock',
  outputIsString: true,
});

const STATUSES = {
  TRIAL: 'in_trial',
  ACTIVE: 'active',
};

function MembershipBlock(props) {
  const {
    title,
    hasPlan,
    planName,
    planStatus,
    trialDaysLeft,
    currentTermEnd,
    trialEnd,
    customerID,
    history,
    generatePortalSession,
    subscriptionID,
    fetchUserSubscription,
    userId,
  } = props;

  const [isChargebeeSessionSetup, setIsChargebeeSessionSetup] = useState(false);

  async function chargebeeAuth() {
    if (window.Chargebee) {
      try {
        const cbInstance = window.Chargebee.getInstance();
        if (cbInstance.authenticated) {
          return true;
        }
        const response = await generatePortalSession(customerID);
        cbInstance.setPortalSession(
          () => new Promise((resolve) => resolve(response.portal_session))
        );
        return true;
      } catch (e) {
        console.error(e);
        toast.error('Something was wrong with the API.');
        return false;
      }
    } else {
      toast.error('Something was wrong with the API.');
      return false;
    }
  }

  async function setupChargebee() {
    try {
      const success = await chargebeeAuth();
      setIsChargebeeSessionSetup(success);
    } catch (e) {
      setIsChargebeeSessionSetup(false);
    }
  }

  function hasExpired() {
    if (!hasPlan) return null;
    let date = '';
    const now = moment(Date.now());
    if (planStatus === STATUSES.TRIAL) {
      date = trialEnd;
    } else {
      date = currentTermEnd;
    }
    const diffExpired = moment(date).diff(now, 'minutes');
    return diffExpired <= 0;
  }

  async function openSection(type, params = {}, callbacks) {
    if (isChargebeeSessionSetup) {
      const cbInstance = window.Chargebee.getInstance();
      const cbPortal = cbInstance.createChargebeePortal();
      cbPortal.openSection(
        {
          sectionType: window.Chargebee.getPortalSections()[type],
          params,
        },
        {
          ...callbacks,
          visit(sectionType) {
            if (callbacks && callbacks.visit) {
              callbacks.visit(sectionType);
            }
            gaEvent({
              category: 'cb-portal',
              action: sectionType,
            });
          },
        }
      );
    } else {
      toast.error('Error loading portal. Retrying...');
      await setupChargebee();
    }
  }

  useEffect(() => {
    setupChargebee();
  }, [customerID]);

  return (
    <Segment fluid className={cx('settings-block', bem())}>
      <Header as="h2" className="settings-block-title">
        {title}
      </Header>
      <SettingsProperty name="Plan" valueChild={hasPlan ? planName : 'None'} />
      {hasPlan && planStatus && (
        <SettingsProperty
          name="Status"
          valueChild={
            <span className={bem('trial-status')}>
              {planStatus.replace('_', ' ')}
            </span>
          }
        />
      )}
      {planStatus === STATUSES.TRIAL && (
        <SettingsProperty name="Trial Days Left" value={trialDaysLeft} />
      )}
      {hasExpired() && (
        <div className={bem('expired')}>
          Your {planStatus === STATUSES.TRIAL ? 'trial' : 'subscription'} has
          expired.
        </div>
      )}
      {planStatus !== STATUSES.ACTIVE && (
        <Button
          color="orange"
          className={bem('upgrade-btn')}
          onClick={() => [
            history.push('/pricing'),
            TrackEvent('settings-clicked-upgrade-now'),
          ]}
        >
          Upgrade Now
        </Button>
      )}
      {customerID && (
        <div>
          <Button
            onClick={() => [
              openSection(
                'SUBSCRIPTION_DETAILS',
                { subscriptionId: subscriptionID },
                {
                  async close() {
                    /**
                     * Chargebee has better callbacks like subscriptionChanged,
                     * which would reduce the times we make this API call without need,
                     * however as of May 23, 2019, they didn't seem to be called.
                     * See: https://www.chargebee.com/checkout-portal-docs/api.html#chargebee-portal-instance-object
                     * Issue: https://support.chargebee.com/support/discussions/topics/325792
                     */
                    await fetchUserSubscription(userId, { update: true });
                  },
                }
              ),
              TrackEvent('settings-clicked-subscription-details'),
            ]}
            color="orange"
            className={bem('section-btn')}
          >
            Subscription Details
          </Button>
          <Button
            onClick={() => [
              openSection('ACCOUNT_DETAILS'),
              TrackEvent('settings-clicked-account-details'),
            ]}
            color="orange"
            className={bem('section-btn')}
          >
            Account Details
          </Button>
          <Button
            onClick={() => [
              openSection('ADDRESS'),
              TrackEvent('settings-clicked-manage-address'),
            ]}
            color="orange"
            className={bem('section-btn')}
          >
            Manage Address
          </Button>
          <Button
            onClick={() => [
              openSection('PAYMENT_SOURCES'),
              TrackEvent('settings-clicked-payment-methods'),
            ]}
            color="orange"
            className={bem('section-btn')}
          >
            Payment Methods
          </Button>
          <Button
            onClick={() => [
              openSection('BILLING_HISTORY'),
              TrackEvent('settings-clicked-billing-history'),
            ]}
            color="orange"
            className={bem('section-btn')}
          >
            Billing History
          </Button>
        </div>
      )}
      {hasPlan && (
        <>
          <p className={bem('popup-help')}>
            Turn off your browser pop up blocker to access subscriptions.
          </p>
          <p className={bem('popup-help on-mobile')}>
            If you are having issues on mobile, try checking from desktop.
          </p>
        </>
      )}
    </Segment>
  );
}

MembershipBlock.propTypes = {
  title: PropTypes.string.isRequired,
  hasPlan: PropTypes.bool.isRequired,
  planName: PropTypes.string,
  planStatus: PropTypes.string,
  fetchUserSubscription: PropTypes.func.isRequired,
  trialDaysLeft: PropTypes.number,
  currentTermEnd: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  trialEnd: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  customerID: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  subscriptionID: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([null]),
  ]),
  userId: PropTypes.string,
  generatePortalSession: PropTypes.func,
  history: PropTypes.shape(),
};

const mapStateToProps = createSelector(
  [
    getUserSubscription,
    getUserHasPlan,
    getDaysLeftOfPlanTrial,
    getCurrentUserId,
  ],
  (subscription = {}, hasPlan, trialDaysLeft, userId) => ({
    hasPlan,
    userId,
    trialDaysLeft,
    ...subscription,
  })
);

const ConnectedMembership = connect(mapStateToProps, {
  fetchUserSubscription: userActions.fetchUserSubscription,
  generatePortalSession: billingActions.generatePortalSession,
})(MembershipBlock);

export default withRouter(ConnectedMembership);
