/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import withSizes from 'react-sizes';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import { compose } from 'redux';
import BEMHelper from 'react-bem-helper';
import cx from 'classnames';
import PhoneInput from 'react-phone-input-2';
import { Modal, Checkbox, Popup, Button } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { withNotifications } from '../HoCs';
import { options, getReminderVal, getFormatedReminder } from './utils';
import {
  updateUserNotifications as updateUserNotificationsAction,
  saveUserSettings as saveUserSettingsAction,
} from '../../Actions/actions_user';
import phoneNumberRegex from '../../utils/phoneNumberRegex';
import { getMyProfileId, getUserProfileData } from '../../selectors/profile';
import './NotificationsModal.scss';

const bem = BEMHelper({ name: 'NotificationsModal', outputIsString: true });

const NotificationsModal = ({
  open,
  myId,
  type,
  onClose,
  isMobile,
  showToast,
  phoneNumber,
  notifications,
  saveUserSettings,
  updateUserNotifications,
  phoneNumberVerified,
}) => {
  const [loading, setLoading] = useState(false);
  const [_notifications, setNotifications] = useState(notifications);
  const [reminder, setReminder] = useState(
    notifications.intention.reminder / 60
  );
  const [_phoneNumber, setPhoneValue] = useState(phoneNumber);
  const shouldShowPhoneInput =
    _notifications.intention.sms || _notifications.checkin.sms;
  const isValidPhone = phoneNumberRegex.test(_phoneNumber);
  function onToggle({ key, type: t, value }) {
    setNotifications({
      ..._notifications,
      [key]: { ..._notifications[key], [t]: value },
    });
  }

  async function onSave() {
    setLoading(true);
    await saveUserSettings({ phone_number: _phoneNumber }, myId, true);
    await updateUserNotifications(
      [
        [
          ...options.map(({ key }) => ({
            key,
            options: [
              { key: 'sms', value: _notifications[key].sms },
              { key: 'email', value: _notifications[key].email },
            ],
          })),
          {
            key: 'intention',
            options: [{ key: 'reminder', value: reminder * 60 }],
          },
        ],
      ],
      true
    );
    setLoading(false);
    if (showToast) {
      toast.success(
        shouldShowPhoneInput
          ? 'Notification preferences and phone number updated.'
          : 'Notification preferences updated.'
      );
    }
    onClose(true);
  }
  function onChangePhone(val) {
    if (val !== '+') setPhoneValue(val.replace(/(\s|-|\(|\))/g, ''));
    else setPhoneValue('');
  }
  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ name: 'close', color: 'grey' }}
      open={open}
      closeOnDimmerClick={false}
      onClose={() => onClose(false)}
      size="small"
      className={cx(bem())}
    >
      <Modal.Content>
        <h3 className={bem('title')}>
          Reminder and Check-in Settings
          <Popup
            trigger={
              <span>
                <i className="far fa-question-circle ml-3" />
                <u>What's this?</u>
              </span>
            }
            on="click"
            className={bem('info-popup')}
            inverted
            hoverable
          >
            Email and SMS reminders will <i>significantly</i> increase your
            follow through for your behaviors.
          </Popup>
        </h3>
        <div className={bem('info')}>
          When do you want to receive Reminders for your events in{' '}
          <strong>this {type}</strong>?
        </div>
        <div
          className={cx(
            'flex flex-col md:flex-row text-center md:text-left',
            bem('reminder')
          )}
        >
          <div className={bem('slider')}>
            <span>{getFormatedReminder(reminder)}</span>
            <Slider
              min={1}
              max={24}
              step={1}
              value={reminder}
              onChange={(value) => setReminder(value)}
            />
          </div>
        </div>
        <div className={bem('info')}>
          How do you want to receive Reminders and Check-ins for{' '}
          <strong>all your plans</strong>?
        </div>
        <div className={bem('options')}>
          <div className={bem('labels')}>
            <div className={cx('flex flex-col pt-5', bem('border'))}>
              <span className="mb-3">Email</span>
              <span className="mb-2">{`SMS ${
                !isMobile ? '(most effective)' : ''
              }`}</span>
            </div>
          </div>
          {options.map((opt) => {
            const activeEmail = _notifications[opt.key].email;
            const activeSms = _notifications[opt.key].sms;
            return (
              <div
                className="flex items-center flex-col"
                key={`nm-opt-${opt.key}`}
              >
                <span className={bem('option-label')}>{opt.label}</span>
                <span className={bem('option-description')}>
                  {opt.subLabel}
                </span>
                <div
                  className={cx(
                    'flex flex-col items-center w-full py-3',
                    bem('border')
                  )}
                >
                  <div className={bem('toggle')}>
                    <Checkbox
                      toggle
                      checked={activeEmail}
                      onClick={() =>
                        onToggle({
                          key: opt.key,
                          value: !activeEmail,
                          type: 'email',
                        })
                      }
                    />
                    <span>{activeEmail ? 'On' : 'Off'}</span>
                  </div>
                  <div className={bem('toggle')}>
                    <Checkbox
                      toggle
                      checked={activeSms}
                      onClick={() =>
                        onToggle({
                          key: opt.key,
                          value: !activeSms,
                          type: 'sms',
                        })
                      }
                    />
                    <span>{activeSms ? 'On' : 'Off'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {shouldShowPhoneInput && (
          <div className={bem('phone')}>
            <span className="phone_no_label">Phone Number</span>
            {phoneNumber && phoneNumberVerified ? (
              <span className="value">{phoneNumber}</span>
            ) : (
              <PhoneInput
                placeholder="+1 (212) 555-1212"
                id="phone_number"
                onChange={onChangePhone}
                disableAreaCodes
                value={_phoneNumber || ''}
                defaultCountry="us"
              />
            )}
            {phoneNumberVerified ? (
              <small className="verified">Active</small>
            ) : phoneNumber ? (
              <small className="inactive verify-pending">
                Pending Verification
              </small>
            ) : (
              <small className="inactive">Inactive</small>
            )}
            {!isValidPhone && (
              <div className={bem('error')}>
                Please enter your country code and phone number.
              </div>
            )}
          </div>
        )}
        <div className="flex justify-center md:justify-end">
          <Button
            color="orange"
            className={bem('save')}
            onClick={onSave}
            loading={loading}
            disabled={shouldShowPhoneInput && !isValidPhone}
          >
            Save
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

NotificationsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  isMobile: PropTypes.bool,
  notifications: PropTypes.shape(),
  updateUserNotifications: PropTypes.func,
  saveUserSettings: PropTypes.func,
  myId: PropTypes.number,
  type: PropTypes.string,
  showToast: PropTypes.bool,
  phoneNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

NotificationsModal.defaultProps = {
  type: 'plan',
  showToast: true,
};

const mapStateToProps = (state) => {
  const myId = getMyProfileId(state);
  const userProfile = getUserProfileData(state, { profileId: myId });
  return {
    phoneNumber: userProfile ? userProfile.phone_number : null,
    phoneNumberVerified: userProfile && userProfile.phone_number_verified,
    myId,
  };
};

const ConnectedNotificatiosnsModal = compose(
  withNotifications({}),
  connect(mapStateToProps, {
    updateUserNotifications: updateUserNotificationsAction,
    saveUserSettings: saveUserSettingsAction,
  }),
  withSizes(({ width }) => ({
    isMobile: width < 768,
  }))
)(NotificationsModal);

export default ConnectedNotificatiosnsModal;
