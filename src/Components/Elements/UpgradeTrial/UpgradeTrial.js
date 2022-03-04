import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getDaysLeftOfPlanTrial } from '../../../reducers/session/selectors';

import './UpgradeTrial.scss';

function UpgradeTrial({ daysLeft }) {
  const daysWord = daysLeft !== 1 ? 'days' : 'day';
  const daysLeftText =
    daysLeft > 0 ? `${daysLeft} ${daysWord} left. Need more?` : 'Trial expired';

  return (
    <div className="UpgradeTrial">
      <p className="UpgradeTrial__text">{daysLeftText}</p>
      <Button
        as={Link}
        to="/pricing"
        className="UpgradeTrial__cta"
        color="pink"
      >
        <span>Upgrade</span>
        <span>Now</span>
      </Button>
    </div>
  );
}

UpgradeTrial.propTypes = {
  daysLeft: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  daysLeft: getDaysLeftOfPlanTrial(state),
});

const ConnectedUpgradeTrial = connect(mapStateToProps, null)(UpgradeTrial);

export default ConnectedUpgradeTrial;
