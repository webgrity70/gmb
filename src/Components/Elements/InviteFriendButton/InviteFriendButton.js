import React from 'react';
import { Button } from 'semantic-ui-react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import './InviteFriendButton.scss';

function InviteFriendButton({ className }) {
  return (
    <Button
      className={cx('InviteFriendButton', className)}
      icon="mail"
      content="Invite a friend"
    />
  );
}

InviteFriendButton.propTypes = {
  className: PropTypes.string,
};

// TODO: Connect this button to redux to do whatever invite a friend does
export default InviteFriendButton;
