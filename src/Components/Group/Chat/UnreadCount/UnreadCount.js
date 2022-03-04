import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Label } from 'semantic-ui-react';

import './UnreadCount.scss';

function UnreadCount({ value, className }) {
  if (!value) {
    return null;
  }
  return (
    <Label
      className={cx('GroupChatUnreadCount', className)}
      circular
      color="orange"
    >
      {value}
    </Label>
  );
}

UnreadCount.propTypes = {
  value: PropTypes.number,
  className: PropTypes.string,
};

export default UnreadCount;
