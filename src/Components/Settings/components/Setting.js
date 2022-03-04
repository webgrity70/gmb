import React from 'react';
import { Form } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import phoneNumberRegex from '../../../utils/phoneNumberRegex';
// import SettingsService from '../../../Services/SettingsService';

const propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  settingKey: PropTypes.string,
  verified: PropTypes.bool,
  updateValue: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  type: PropTypes.string,
};

const defaultProps = {
  value: '',
  settingKey: undefined,
  type: 'text',
  verified: false,
};

/* const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const showVerification = phoneNumberRegex.test(value) && type === 'phone' && editing;
  async function sendVerificationCode() {
    const response = await SettingsService.sendPhoneVerificationCode(value);
    console.log(response);
    setCodeSent(true);
  }
  function onVerifyCode() {

  } */
const Setting = ({
  label,
  editing,
  settingKey,
  updateValue,
  value,
  verified,
  type,
}) => (
  <Form.Group inline>
    <div className="flex flex-col flex-1">
      <div className="flex items-center flex-1">
        {label ? (
          <label htmlFor={settingKey} className="mr-4">
            {label}
          </label>
        ) : null}
        {editing && settingKey ? (
          // Editing
          <React.Fragment>
            {type === 'text' && (
              <Form.Input
                value={value}
                onChange={updateValue}
                name={settingKey}
                id={settingKey}
                width={12}
                className="w-full"
              />
            )}
            {type === 'phone' && (
              <PhoneInput
                value={value || ''}
                disableAreaCodes
                placeholder="+1 (212) 555-1212"
                defaultCountry="us"
                onChange={(phone) => {
                  updateValue(undefined, {
                    name: settingKey,
                    value:
                      phone !== '+' ? phone.replace(/(\s|-|\(|\))/g, '') : '',
                  });
                }}
              />
            )}
          </React.Fragment>
        ) : (
          // Viewing
          <React.Fragment>
            <span className="value">
              {value ? value : type === 'phone' && <i>Add phone</i>}
            </span>
            &nbsp;
            {verified && type !== 'phone' ? (
              <small className="verified">Verified</small>
            ) : null}
            {type === 'phone' && (
              <span className="verification-label">
                <small
                  className={
                    value && verified ? 'verified' : 'inactive verify-pending'
                  }
                >
                  {value && verified
                    ? 'Verified'
                    : value && 'Pending Verification'}
                </small>
                {!value && (
                  <>
                    <span>SMS Notifications:</span>
                    <small className="inactive">Inactive</small>
                  </>
                )}
              </span>
            )}
          </React.Fragment>
        )}
      </div>
      {/* showVerification && (
          <div className="mt-4 verification-code">
            {codeSent && (
              <>
                <Input
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e, { value: val }) => setVerificationCode(val)}
                />
                <Button basic color="orange" onClick={onVerifyCode}>
                  Verify Code
                </Button>
              </>
            )}
            <Button color="orange" onClick={sendVerificationCode}>
              {codeSent ? 'Resend' : 'Send'} Verification Code
            </Button>
          </div>
            ) */}
      {editing &&
        settingKey &&
        !phoneNumberRegex.test(value) &&
        type === 'phone' && (
          <div className="warning-input">
            Please enter your country code and phone number.
          </div>
        )}
    </div>
  </Form.Group>
);
Setting.propTypes = propTypes;
Setting.defaultProps = defaultProps;

export default Setting;
