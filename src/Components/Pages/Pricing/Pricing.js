import React, { PureComponent } from 'react';
import cx from 'classnames';
import { Container } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { TrackEvent } from '../../../Services/TrackEvent';
import BillingPlan from '../../Pricing/BillingPlan';

import './Pricing.scss';

const bem = BEMHelper({ name: 'PricingPage', outputIsString: true });

const plans = {
  solo: {
    name: 'Solo',
    monthlyPrice: 500,
    annualPrice: 5400,
    annualSaving: 10,
    description: 'The very basic',
    features: [
      'Choose your habits',
      'Plan and Check in',
      'See Your Progress',
      'Build Your Score',
    ],
    color: 'green',
    monthlyPlanName: 'solo-monthly',
    annualPlanName: 'solo-annual',
    onClickSubscribe: () => TrackEvent('pricing-click-sub-ann-solo'),
    onClickMonthly: () => TrackEvent('pricing-click-sub-monthly-solo'),
  },
  duo: {
    name: 'Duo',
    monthlyPrice: 900,
    annualPrice: 8700,
    annualSaving: 20,
    description: 'Includes Solo and',
    features: [
      'Match with buddies',
      'Find New Buddies',
      'Share Calendars',
      ' Chat/Support',
      'Compare/Compete',
    ],
    color: 'blue',
    monthlyPlanName: 'duo-monthly',
    annualPlanName: 'duo-annual',
    onClickSubscribe: () => TrackEvent('pricing-click-sub-ann-duo'),
    onClickMonthly: () => TrackEvent('pricing-click-sub-monthly-duo'),
  },
  everything: {
    name: 'Everything',
    monthlyPrice: 2499,
    annualPrice: 17988,
    annualSaving: 40,
    description: 'The most comprehensive system for social behavior change.',
    features: [
      'Behavioral Plans',
      'Accountability Buddies',
      'Calendars and Check-ins',
      'Groups & Points',
      'Email & SMS Triggers',
      'Cohort Based Challenges',
    ],
    color: 'orange',
    monthlyPlanName: 'everything-monthly',
    annualPlanName: 'everything-annual',
    recommended: true,
    onClickSubscribe: () => TrackEvent('pricing-click-sub-ann-everything'),
    onClickMonthly: () => TrackEvent('pricing-click-sub-monhtly-everything'),
  },
};

class Pricing extends PureComponent {
  render() {
    const { user } = this.props;
    return (
      <div className={bem()}>
        <Container>
          <h3 className={bem('subtitle')}>
            Change your behavior for one low, simple price.​
          </h3>
          <div
            className={cx(
              bem('plans'),
              'flex flex-col md:flex-row justify-center'
            )}
          >
            <div className={bem('plan', ['popular'])}>
              <BillingPlan {...plans.everything} user={user} />
            </div>
          </div>
          <div
            className={bem('form-links', '', 'flex flex-col items-center mt-8')}
          >
            <a
              rel="noopener noreferrer"
              target="_blank"
              href="https://forms.gle/oYpd8KdXfKP2RheKA"
            >
              GetMotivatedBuddies for Gyms, Schools and Organizations.
            </a>
            <a
              rel="noopener noreferrer"
              target="_blank"
              className="mt-4"
              href="https://forms.gle/jziL9A13K2BtzMci6"
            >
              Are you a Student?
            </a>
          </div>
          <div className={bem('testimonial', '', 'flex flex-col items-center')}>
            <blockquote>
              Purchasing a subscription was a no-brainer, as I find my time very
              valuable, and I already was seeing improvements in my habits. I
              would recommend this service to anyone who is looking to make
              their days not only more successful, but also socially fulfilling.
            </blockquote>
            <div className={bem('testimonial-divider')} />
            <footer>Esther P., Software Engineer</footer>
          </div>
        </Container>
      </div>
    );
  }
}

Pricing.propTypes = {
  user: PropTypes.shape({}),
};

export default Pricing;
