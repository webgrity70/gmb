import React from 'react';
import * as PropTypes from 'prop-types';
import { Grid, Icon } from 'semantic-ui-react';
import TurnAllComponent from './TurnAllComponent';
import OptionLabelComponent from './OptionLabelComponent';
import OptionCheckboxComponent from './OptionCheckboxComponent';
import OptionSliderComponent from './OptionSliderComponent';

const propTypes = {
  title: PropTypes.string.isRequired,
  hideAll: PropTypes.bool,
  description: PropTypes.string,
  descriptionOnly: PropTypes.bool,
  extraColumnCount: PropTypes.number,
  alternateLabel: PropTypes.string,
  notificationSettings: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      description: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          label: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
          disabled: PropTypes.bool,
        })
      ),
    })
  ).isRequired,
  user: PropTypes.shape({
    phone_number: PropTypes.string,
  }).isRequired,
  editing: PropTypes.bool.isRequired,
  updateSettings: PropTypes.func.isRequired,
  toggleGlobally: PropTypes.func.isRequired,
};

class NotificationGroup extends React.Component {
  static canChange(option, user) {
    if (option.key === 'sms' && !user.phone_number) {
      return 'You need a phone number.';
    }
    return undefined;
  }

  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  handleToggle(e, element) {
    /**
     * Element passed.
     * @param element.checked {bool} Whether it is checked or not.
     * @param element.setting {string} Setting key.
     * @param element.name {string} Element name. (email/sms/push)
     */
    const { updateSettings } = this.props;
    updateSettings(element.setting, element.name, element.checked);
  }

  handleSliderChange(setting, name, value) {
    const { updateSettings } = this.props;
    updateSettings(setting, name, value === 0 ? 10 : value);
  }

  globalToggleState() {
    const { notificationSettings } = this.props;
    let foundOn = false;
    if (notificationSettings) {
      notificationSettings.forEach((item) => {
        item.options.forEach((option) => {
          if (option.value === true) {
            foundOn = true;
          }
        });
      });
    }
    return foundOn;
  }

  render() {
    const {
      title,
      notificationSettings,
      editing,
      hideAll,
      description,
      descriptionOnly,
      extraColumnCount,
      alternateLabel,
      toggleGlobally,
      user,
    } = this.props;
    const globalToggle = this.globalToggleState();
    const notificationSettingLength = notificationSettings
      ? notificationSettings.length
      : 1;

    const siteNotificationOption = (setting) => {
      return setting.options.find((o) => o.key === 'site');
    };

    const emailNotificationOption = (setting) => {
      return setting.options.find((o) => o.key === 'email');
    };

    const smsNotificationOption = (setting) => {
      return setting.options.find((o) => o.key === 'sms');
    };

    const reminderNotificationOption = (setting) => {
      return setting.options.find((o) => o.key === 'reminder');
    };

    const settingContains = (key) => {
      let result = false;
      for (let i = 0; i < notificationSettings.length; i++) {
        const setting = notificationSettings[i];
        const found = setting.options.find((o) => o.key === key);
        if (found) {
          result = true;
          break;
        }
      }
      return result;
    };

    const settingNotificationTypeCount = () => {
      const types = ['site', 'email', 'sms', 'reminder'];
      let count = 0;
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        if (settingContains(type)) {
          count++;
        }
      }
      return count;
    };

    return (
      <Grid.Column
        mobile={16}
        tablet={16}
        computer={16}
        className="notifications-content"
      >
        <div className="group-header">
          <h3>{title.toUpperCase()}</h3>
          {!hideAll && (
            <TurnAllComponent
              label="Turn all notifications:"
              checked={globalToggle}
              onChange={toggleGlobally}
              editing={editing}
            />
          )}
        </div>
        {descriptionOnly ? (
          <p className="group-description">
            {description} <Icon name="bell" color="orange" />
          </p>
        ) : (
          <Grid
            columns={
              settingNotificationTypeCount() + 1 + (extraColumnCount || 0)
            }
            className="notification-settings"
          >
            <Grid.Row className="notification-headers">
              <Grid.Column></Grid.Column>
              {settingContains('site') && (
                <Grid.Column textAlign="center">
                  <h5>Site</h5>
                </Grid.Column>
              )}
              {settingContains('email') && (
                <Grid.Column textAlign="center">
                  <h5>{alternateLabel ? alternateLabel : 'Email'}</h5>
                </Grid.Column>
              )}
              {settingContains('sms') && (
                <Grid.Column textAlign="center">
                  <h5>SMS</h5>
                </Grid.Column>
              )}
              {settingContains('reminder') && (
                <Grid.Column textAlign="center">
                  <h5>Time to Receive</h5>
                </Grid.Column>
              )}
            </Grid.Row>
            {notificationSettings.map((setting) => (
              <Grid.Row key={setting.key}>
                <Grid.Column>
                  <OptionLabelComponent label={setting.label} />
                </Grid.Column>
                {settingContains('site') && (
                  <Grid.Column
                    className="notification-setting"
                    textAlign="center"
                  >
                    {siteNotificationOption(setting) && (
                      <OptionCheckboxComponent
                        value={
                          NotificationGroup.canChange(
                            siteNotificationOption(setting),
                            user
                          )
                            ? false
                            : siteNotificationOption(setting).value
                        }
                        setting={setting.key}
                        name={siteNotificationOption(setting).key}
                        editing={editing}
                        onChange={this.handleToggle}
                        disabled={siteNotificationOption(setting).disabled}
                        tooltip={
                          siteNotificationOption(setting).disabled &&
                          'This setting cannot be turned off.'
                        }
                      />
                    )}
                  </Grid.Column>
                )}
                {settingContains('email') && (
                  <Grid.Column
                    className="notification-setting"
                    textAlign="center"
                  >
                    {emailNotificationOption(setting) && (
                      <OptionCheckboxComponent
                        value={
                          NotificationGroup.canChange(
                            emailNotificationOption(setting),
                            user
                          )
                            ? false
                            : emailNotificationOption(setting).value
                        }
                        setting={setting.key}
                        name={emailNotificationOption(setting).key}
                        editing={editing}
                        onChange={this.handleToggle}
                      />
                    )}
                  </Grid.Column>
                )}
                {settingContains('sms') && (
                  <Grid.Column
                    className="notification-setting"
                    textAlign="center"
                  >
                    {smsNotificationOption(setting) && (
                      <OptionCheckboxComponent
                        value={
                          NotificationGroup.canChange(
                            smsNotificationOption(setting),
                            user
                          )
                            ? false
                            : smsNotificationOption(setting).value
                        }
                        setting={setting.key}
                        name={smsNotificationOption(setting).key}
                        editing={editing}
                        onChange={this.handleToggle}
                        disabled={Boolean(
                          NotificationGroup.canChange(
                            smsNotificationOption(setting),
                            user
                          )
                        )}
                        tooltip={NotificationGroup.canChange(
                          smsNotificationOption(setting),
                          user
                        )}
                      />
                    )}
                  </Grid.Column>
                )}
                {settingContains('reminder') && (
                  <Grid.Column textAlign="center">
                    {reminderNotificationOption(setting) && (
                      <OptionSliderComponent
                        value={reminderNotificationOption(setting).value}
                        setting={setting.key}
                        name={reminderNotificationOption(setting).key}
                        editing={editing}
                        onChange={this.handleSliderChange}
                      />
                    )}
                  </Grid.Column>
                )}
              </Grid.Row>
            ))}
          </Grid>
        )}
      </Grid.Column>
    );
  }
}

NotificationGroup.propTypes = propTypes;

export default NotificationGroup;
