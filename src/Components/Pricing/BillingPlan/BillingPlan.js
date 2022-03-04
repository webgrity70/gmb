import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Segment, Label, List } from 'semantic-ui-react';
import BEMHelper from 'react-bem-helper';
import * as userActions from '../../../Actions/actions_user';
import * as billingActions from '../../../Actions/actions_billing';
import { gaEvent, gaTransaction } from '../../../utils/gtm';
import './BillingPlan.scss';

const bem = BEMHelper({ name: 'BillingPlan', outputIsString: true });

function getPriceValue(price) {
  const priceInDollars = price / 100;
  const hasCents = price % 100 > 0;
  const formattedPrice = priceInDollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const priceValue = hasCents ? formattedPrice : formattedPrice.slice(0, -3);
  return priceValue;
}

function BillingPlan({
  onClickMonthly,
  onClickSubscribe,
  fetchUserSubscription,
  user,
  history,
  monthlyPlanName,
  annualPlanName,
  createHostedCheckout,
  color,
  recommended,
  features,
  description,
  annualPrice,
  monthlyPrice,
  trialPeriod,
  name,
}) {
  function choosePlan(plan) {
    if (window.Chargebee) {
      const cbInstance = window.Chargebee.getInstance();
      cbInstance.openCheckout({
        async hostedPage() {
          const data = await createHostedCheckout(plan.id);
          return data.message;
        },
        async success(hostedPageId, data) {
          const invoice = data && data.invoice;
          if (invoice) {
            gaTransaction({
              transactionId: invoice.id,
              transactionTotal: invoice.total / 100,
              transactionProducts: [
                {
                  sku: plan.id,
                  name: plan.name,
                  price: invoice.total / 100,
                  quantity: 1,
                },
              ],
            });
          } else {
            gaEvent({
              category: 'engagement',
              action: 'generate_lead',
            });
          }
          await fetchUserSubscription(user.pk, { update: true });
          cbInstance.closeAll();
          history.push('/settings/subscriptions');
        },
        loaded() {
          gaEvent({
            category: 'ecommerce',
            action: 'begin_checkout',
          });
        },
        step(page) {
          gaEvent({
            category: 'cb-checkout',
            action: page,
          });
        },
      });
    }
  }

  const monthlyPriceValue = getPriceValue(monthlyPrice);
  const annualPriceDollars = annualPrice / 100;

  return (
    <div className={cx(bem('', `color-${color}`))}>
      <Segment.Group className="BillingPlan__card" raised>
        <Segment className={bem('name')} textAlign="center">
          {name}
        </Segment>
        <Segment className={bem('pricing')} textAlign="center">
          <div className={cx(bem('annual-price'), 'flex')}>
            <span className={bem('annual-price-int')}>
              ${Math.floor(annualPriceDollars / 12)}
            </span>
            <div className="flex flex-col justify-between mb-3">
              <span className={bem('annual-price-dec')}>
                {(((annualPriceDollars / 12) % 1) * 100).toFixed(0)}
              </span>
              <span>/month</span>
            </div>
          </div>
          <p className={bem('monthly')}>
            billed annually
            <br />
            or
            <span className={cx(bem('colored'), bem('monthly-price'))}>
              {' '}
              {monthlyPriceValue}
            </span>
            /monthly
          </p>
        </Segment>
        <Segment textAlign="left">
          <p className={cx('text-center', bem('description'))}>{description}</p>
          <List className={bem('features')}>
            {features.map((feature) => (
              <List.Item>
                <List.Icon className={bem('colored')} name="checkmark" />
                <List.Content>{feature}</List.Content>
              </List.Item>
            ))}
          </List>
        </Segment>
        {trialPeriod && (
          <Segment textAlign="center">
            <Label color="pink" className="BillingPlan__trial">
              {trialPeriod}
            </Label>
          </Segment>
        )}
        <Segment className="BillingPlan__cta-wrapper" textAlign="center">
          <div>
            {user ? (
              <div className="flex flex-col items-center">
                <Button
                  className="BillingPlan__cta"
                  onClick={() => [
                    choosePlan({
                      name: `${name} - Annual Subscription`,
                      id: annualPlanName,
                    }),
                    onClickSubscribe(),
                  ]}
                  inverted={!recommended}
                >
                  Subscribe Now
                </Button>
                <button
                  type="button"
                  className={cx(
                    'BillingPlan__monthly_cta mt-3',
                    bem('colored')
                  )}
                  onClick={() => [
                    choosePlan({
                      name: `${name} - Monthly Subscription`,
                      id: monthlyPlanName,
                    }),
                    onClickMonthly(),
                  ]}
                >
                  Get Monthly Subscription
                </button>
              </div>
            ) : (
              <Button
                as={Link}
                to="/register"
                className="BillingPlan__cta"
                inverted
              >
                Sign Up
              </Button>
            )}
          </div>
        </Segment>
      </Segment.Group>
    </div>
  );
}

BillingPlan.propTypes = {
  name: PropTypes.string,
  monthlyPrice: PropTypes.number,
  annualPrice: PropTypes.number,
  description: PropTypes.string,
  trialPeriod: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.string),
  color: PropTypes.string,
  monthlyPlanName: PropTypes.string,
  annualPlanName: PropTypes.string,
  fetchUserSubscription: PropTypes.func.isRequired,
  user: PropTypes.shape(),
  recommended: PropTypes.bool,
  history: PropTypes.shape(),
  onClickMonthly: PropTypes.func,
  onClickSubscribe: PropTypes.func,
  createHostedCheckout: PropTypes.func,
};

export default withRouter(
  connect(null, {
    fetchUserSubscription: userActions.fetchUserSubscription,
    createHostedCheckout: billingActions.createHostedCheckout,
  })(BillingPlan)
);
