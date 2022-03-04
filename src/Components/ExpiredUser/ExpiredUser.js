/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Modal } from 'semantic-ui-react';
import './ExpiredUser.scss';

const ExpiredUser = ({ history, show, toggle }) => (
  <Modal
    dimmer="inverted"
    open={show}
    onClose={toggle}
    className="ExpiredUser"
    size="tiny"
    closeIcon
    opene={show}
    closeOnDimmerClick={false}
  >
    <Modal.Content>
      <h3>Your subscription has expired! </h3>
      <p>
        Please subscribe to a Plan to continue to build your habits, and make a
        positive long lasting change by fully committing to your goal.
      </p>

      <Button
        color="orange"
        onClick={() => [toggle(), history.push('/pricing')]}
      >
        Select a Plan
      </Button>
    </Modal.Content>
  </Modal>
);
ExpiredUser.propTypes = {
  show: PropTypes.bool,
  toggle: PropTypes.func,
  history: PropTypes.shape({}),
};

export default compose(withRouter)(ExpiredUser);
