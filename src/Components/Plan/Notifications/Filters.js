/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import capitalize from 'lodash/capitalize';
import cx from 'classnames';
import { options, states } from './utils';
import { bem } from './index';
import { withNotifications } from '../../HoCs';
import { updateUserNotifications as updateUserNotificationsAction } from '../../../Actions/actions_user';

const Filters = ({ notifications, updateUserNotifications }) => {
  function onToggle({ key, type, value }) {
    const updatedVal = [
      [
        {
          key,
          options: [{ key: type, label: capitalize(type), value }],
        },
      ],
    ];
    updateUserNotifications(updatedVal);
  }
  return (
    <div>
      <span>Calendar Notifications</span>
      {options.map((opt) => (
        <div className={bem('notification-title')} key={opt.label}>
          <span>{opt.label}</span>
          <div />
          <div>
            <div className={bem('option')}>
              <span className="label">Email</span>
              {states.map((state) => (
                <span
                  key={`email-${state.label}`}
                  className={cx('flex-1', {
                    active: notifications[opt.key].email === state.value,
                  })}
                  onClick={() =>
                    onToggle({
                      key: opt.key,
                      value: state.value,
                      type: 'email',
                    })
                  }
                >
                  {state.label}
                </span>
              ))}
            </div>
            <div className={bem('option')}>
              <span className="label">SMS</span>
              {states.map((state) => (
                <span
                  key={`sms-${state.label}`}
                  className={cx('flex-1', {
                    active: notifications[opt.key].sms === state.value,
                  })}
                  onClick={() =>
                    onToggle({ key: opt.key, value: state.value, type: 'sms' })
                  }
                >
                  {state.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

Filters.propTypes = {
  notifications: PropTypes.shape(),
  updateUserNotifications: PropTypes.func,
};

export default compose(
  withNotifications({}),
  connect(null, { updateUserNotifications: updateUserNotificationsAction })
)(Filters);
