import React from 'react';
import { Grid, Header, Segment, Button, Icon } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotificationGroup from './NotificationGroup';
import * as userActions from '../../../Actions/actions_user';
import { TrackEvent } from '../../../Services/TrackEvent';

const propTypes = {
  getNotificationSettings: PropTypes.func,
  updateNotifications: PropTypes.func,
  title: PropTypes.string.isRequired,
  user: PropTypes.shape({
    phone_number: PropTypes.string,
  }).isRequired,
};

class NotificationsBlock extends React.Component {
  static updateSettingGroup(options, setting, element, value) {
    const modifiedOptions = options;
    const index = modifiedOptions.findIndex((item) => item.key === setting);
    if (index === -1) return options;
    const optionIndex = modifiedOptions[index].options.findIndex(
      (option) => option.key === element
    );
    if (optionIndex === -1) return options;
    modifiedOptions[index].options[optionIndex].value = value;
    return modifiedOptions;
  }

  static updateGlobalGroup(options, checked) {
    const modifiedOption = options;
    for (let i = 0; i < modifiedOption.length; i += 1) {
      for (let j = 0; j < modifiedOption[i].options.length; j += 1) {
        if (typeof modifiedOption[i].options[j].value === 'boolean') {
          modifiedOption[i].options[j].value = checked;
        }
      }
    }
    return modifiedOption;
  }

  state = {
    calendarOptions: [
      {
        key: 'intention',
        label: 'Confirmations',
        options: [
          {
            key: 'email',
            label: 'Email',
            value: true,
          },
          {
            key: 'sms',
            label: 'SMS',
            value: false,
          },
          {
            key: 'reminder',
            label: 'Time to Receive',
            value: 1440,
          },
        ],
      },
      {
        key: 'checkin',
        label: 'Check ins',
        description: 'Check-ins arrive after your activity has begun.',
        options: [
          {
            key: 'email',
            label: 'Email',
            value: true,
          },
          {
            key: 'sms',
            label: 'SMS',
            value: false,
          },
        ],
      },
    ],
    buddiesOptions: [
      {
        key: 'budintention',
        label: 'Confirmations',
        options: [
          {
            key: 'site',
            label: 'Confirmations',
            value: true,
          },
          {
            key: 'email',
            label: 'Confirmations',
            value: true,
          },
        ],
      },
      {
        key: 'budcheckin',
        label: 'Check ins',
        options: [
          {
            key: 'site',
            label: 'Check ins',
            value: true,
          },
          {
            key: 'email',
            label: 'Check ins',
            value: true,
          },
        ],
      },
    ],
    buddiesReqOptions: [
      {
        key: 'requests',
        label: 'New Chat Requests',
        options: [
          {
            key: 'email',
            label: 'Receive Chat Requests',
            value: true,
          },
        ],
      },
      {
        key: 'recommendations',
        label: 'Auto Match',
        options: [
          {
            key: 'email',
            label: 'Auto Match',
            value: true,
          },
        ],
      },
    ],
    moreOptions: [],
    groupOptions: [],
    challengeOptions: [],
    editing: false,
  };

  constructor(props) {
    super(props);
    this.cancel = this.cancel.bind(this);
    this.edit = this.edit.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.updateCalendarSettings = this.updateCalendarSettings.bind(this);
    this.toggleCalendarSettingsGlobally = this.toggleCalendarSettingsGlobally.bind(
      this
    );
    this.updateBuddiesSettings = this.updateBuddiesSettings.bind(this);
    this.toggleBuddiesSettingsGlobally = this.toggleBuddiesSettingsGlobally.bind(
      this
    );
    this.updateBuddiesReqSettings = this.updateBuddiesReqSettings.bind(this);
    this.toggleBuddiesReqSettingsGlobally = this.toggleBuddiesReqSettingsGlobally.bind(
      this
    );
    this.updateGroupSettings = this.updateGroupSettings.bind(this);
    this.toggleGroupSettingsGlobally = this.toggleGroupSettingsGlobally.bind(
      this
    );
    this.updateChallengeSettings = this.updateChallengeSettings.bind(this);
    this.toggleChallengeSettingsGlobally = this.toggleChallengeSettingsGlobally.bind(
      this
    );
    this.updateMoreSettings = this.updateMoreSettings.bind(this);
    this.toggleMoreSettingsGlobally = this.toggleMoreSettingsGlobally.bind(
      this
    );
    this.calendarRef = React.createRef();
  }

  UNSAFE_componentWillMount = () => {
    this.getSettings();
  };

  componentDidMount = () => {
    const section = this.props.location.search.split('section=')[1];
    if (section && section === 'calendar') {
      window.scrollTo(0, 430);
    }
  };

  getSettings = () => {
    const { getNotificationSettings } = this.props;
    const {
      calendarOptions,
      buddiesOptions,
      buddiesReqOptions,
      moreOptions,
      groupOptions,
      challengeOptions,
    } = this.state;
    this.setState({ loading: true });
    getNotificationSettings()
      .then((data) => {
        Object.keys(data).forEach((setting) => {
          const coIndex = calendarOptions.findIndex(
            (coSetting) => coSetting.key === setting
          );
          const boIndex = buddiesOptions.findIndex(
            (boSetting) => boSetting.key === setting
          );
          const broIndex = buddiesReqOptions.findIndex(
            (broSetting) => broSetting.key === setting
          );
          const goIndex = groupOptions.findIndex(
            (goSetting) => goSetting.key === setting
          );
          const choIndex = challengeOptions.findIndex(
            (choSetting) => choSetting.key === setting
          );
          const moIndex = moreOptions.findIndex(
            (moSetting) => moSetting.key === setting
          );
          if (coIndex !== -1) {
            Object.keys(data[setting]).forEach((option) => {
              const value = data[setting][option];
              const csIndex = calendarOptions[coIndex].options.findIndex(
                (csOption) => csOption.key === option
              );
              if (csIndex === -1) return;
              calendarOptions[coIndex].options[csIndex].value = value;
            });
          } else if (boIndex !== -1) {
            Object.keys(data[setting]).forEach((option) => {
              const value = data[setting][option];
              const bsIndex = buddiesOptions[boIndex].options.findIndex(
                (bsOption) => bsOption.key === option
              );
              if (bsIndex === -1) return;
              buddiesOptions[boIndex].options[bsIndex].value = value;
            });
          } else if (broIndex !== -1) {
            Object.keys(data[setting]).forEach((option) => {
              const value = data[setting][option];
              const brsIndex = buddiesReqOptions[broIndex].options.findIndex(
                (brsOption) => brsOption.key === option
              );
              if (brsIndex === -1) return;
              buddiesReqOptions[broIndex].options[brsIndex].value = value;
            });
          } else if (goIndex !== -1) {
            Object.keys(data[setting]).forEach((option) => {
              const value = data[setting][option];
              const gsIndex = groupOptions[goIndex].options.findIndex(
                (gsOption) => gsOption.key === option
              );
              if (gsIndex === -1) return;
              groupOptions[goIndex].options[gsIndex].value = value;
            });
          } else if (moIndex !== -1) {
            Object.keys(data[setting]).forEach((option) => {
              const value = data[setting][option];
              const msIndex = moreOptions[moIndex].options.findIndex(
                (msOption) => msOption.key === option
              );
              if (msIndex === -1) return;
              moreOptions[moIndex].options[msIndex].value = value;
            });
          } else if (choIndex !== -1) {
            Object.keys(data[setting]).forEach((option) => {
              const value = data[setting][option];
              const chsIndex = challengeOptions[choIndex].options.findIndex(
                (chsOption) => chsOption.key === option
              );
              if (chsIndex === -1) return;
              challengeOptions[choIndex].options[chsIndex].value = value;
            });
          }
        });
        this.setState({
          calendarOptions,
          buddiesOptions,
          buddiesReqOptions,
          moreOptions,
          groupOptions,
          challengeOptions,
          editing: false,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  save = () => {
    const { updateNotifications } = this.props;
    const {
      calendarOptions,
      buddiesOptions,
      buddiesReqOptions,
      moreOptions,
      groupOptions,
      challengeOptions,
    } = this.state;
    const options = [
      calendarOptions,
      buddiesOptions,
      buddiesReqOptions,
      moreOptions,
      groupOptions,
      challengeOptions,
    ];
    this.setState({ loading: true });
    updateNotifications(options)
      .then(() => {
        this.getSettings();
      })
      .catch(() => {
        this.setState({ loading: false });
      });
    this.setState({ editing: false });
  };

  updateValue = (e, value) => {
    const { settings } = this.state;
    const index = settings.findIndex((item) => item.key === value.name);
    const setting = settings[index];
    setting.value = value.value;
    settings[index] = setting;
    this.setState({ settings });
  };

  cancel() {
    this.getSettings();
  }

  edit() {
    this.setState({ editing: true });
  }

  updateCalendarSettings(setting, element, value) {
    const { calendarOptions } = this.state;
    const opt = NotificationsBlock.updateSettingGroup(
      calendarOptions,
      setting,
      element,
      value
    );
    this.setState({ calendarOptions: opt });
  }

  updateBuddiesSettings(setting, element, value) {
    const { buddiesOptions } = this.state;
    const opt = NotificationsBlock.updateSettingGroup(
      buddiesOptions,
      setting,
      element,
      value
    );
    this.setState({ buddiesOptions: opt });
  }

  updateBuddiesReqSettings(setting, element, value) {
    const { buddiesReqOptions } = this.state;
    const opt = NotificationsBlock.updateSettingGroup(
      buddiesReqOptions,
      setting,
      element,
      value
    );
    this.setState({ buddiesReqOptions: opt });
  }

  updateGroupSettings(setting, element, value) {
    const { groupOptions } = this.state;
    const opt = NotificationsBlock.updateSettingGroup(
      groupOptions,
      setting,
      element,
      value
    );
    this.setState({ groupOptions: opt });
  }

  updateChallengeSettings(setting, element, value) {
    const { challengeOptions } = this.state;
    const opt = NotificationsBlock.updateSettingGroup(
      challengeOptions,
      setting,
      element,
      value
    );
    this.setState({ challengeOptions: opt });
  }

  updateMoreSettings(setting, element, value) {
    const { moreOptions } = this.state;
    const opt = NotificationsBlock.updateSettingGroup(
      moreOptions,
      setting,
      element,
      value
    );
    this.setState({ moreOptions: opt });
  }

  toggleCalendarSettingsGlobally(e, element) {
    const { calendarOptions } = this.state;
    const opt = NotificationsBlock.updateGlobalGroup(
      calendarOptions,
      element.checked
    );
    TrackEvent('settings-notification-position', opt);
    this.setState({ calendarOptions: opt });
  }

  toggleBuddiesSettingsGlobally(e, element) {
    const { buddiesOptions } = this.state;
    const opt = NotificationsBlock.updateGlobalGroup(
      buddiesOptions,
      element.checked
    );
    this.setState({ buddiesOptions: opt });
  }

  toggleBuddiesReqSettingsGlobally(e, element) {
    const { buddiesReqOptions } = this.state;
    const opt = NotificationsBlock.updateGlobalGroup(
      buddiesReqOptions,
      element.checked
    );
    this.setState({ buddiesReqOptions: opt });
  }

  toggleGroupSettingsGlobally(e, element) {
    const { groupOptions } = this.state;
    const opt = NotificationsBlock.updateGlobalGroup(
      groupOptions,
      element.checked
    );
    this.setState({ groupOptions: opt });
  }

  toggleChallengeSettingsGlobally(e, element) {
    const { challengeOptions } = this.state;
    const opt = NotificationsBlock.updateGlobalGroup(
      challengeOptions,
      element.checked
    );
    this.setState({ challengeOptions: opt });
  }

  toggleMoreSettingsGlobally(e, element) {
    const { moreOptions } = this.state;
    const opt = NotificationsBlock.updateGlobalGroup(
      moreOptions,
      element.checked
    );
    this.setState({ moreOptions: opt });
  }

  render() {
    const { title, user } = this.props;
    const {
      editing,
      calendarOptions,
      moreOptions,
      loading,
      buddiesOptions,
      buddiesReqOptions,
      groupOptions,
      challengeOptions,
    } = this.state;
    return (
      <Segment fluid className="settings-block">
        <Header as="h2" className="settings-block-title">
          {title}
        </Header>
        <Grid>
          <Segment basic loading={loading}>
            <div ref={this.calendarRef}>
              <NotificationGroup
                title="General"
                notificationSettings={calendarOptions}
                editing={editing}
                updateSettings={this.updateCalendarSettings}
                toggleGlobally={this.toggleCalendarSettingsGlobally}
                user={user}
              />
            </div>

            <NotificationGroup
              title="Chat Requests & Auto-Match"
              notificationSettings={buddiesReqOptions}
              editing={editing}
              updateSettings={this.updateBuddiesReqSettings}
              toggleGlobally={this.toggleBuddiesReqSettingsGlobally}
              hideAll
              extraColumnCount={2}
              alternateLabel="Site/Email"
            />
            <NotificationGroup
              title="Buddies"
              notificationSettings={buddiesOptions}
              editing={editing}
              updateSettings={this.updateBuddiesSettings}
              toggleGlobally={this.toggleBuddiesSettingsGlobally}
              hideAll
              extraColumnCount={1}
            />
            <NotificationGroup
              title="Groups"
              notificationSettings={groupOptions}
              editing={editing}
              updateSettings={this.updateGroupSettings}
              toggleGlobally={this.toggleGroupSettingsGlobally}
              description="To change notifications for a particular group, go to that group page and click on the bell."
              descriptionOnly
              hideAll
            />
            <NotificationGroup
              title="Challenges"
              notificationSettings={challengeOptions}
              editing={editing}
              updateSettings={this.updateChallengeSettings}
              toggleGlobally={this.toggleChallengeSettingsGlobally}
              description="To change notifications for a particular challenge, go to that challenge page and click on the bell."
              descriptionOnly
              hideAll
            />
          </Segment>
          <hr className="settings-bottom" />
          <div className="actions">
            <ul>
              {!editing ? (
                <li>
                  <Icon
                    name="pencil"
                    onClick={this.edit}
                    className="orange-color pointer"
                  />
                </li>
              ) : null}
              {editing ? (
                <React.Fragment>
                  <li>
                    <Button onClick={this.cancel}>Cancel</Button>
                  </li>
                  <li>
                    <Button onClick={this.save} color="orange">
                      Save
                    </Button>
                  </li>
                </React.Fragment>
              ) : null}
            </ul>
          </div>
        </Grid>
      </Segment>
    );
  }
}

NotificationsBlock.propTypes = propTypes;

export default connect(null, {
  updateNotifications: userActions.updateUserNotifications,
  getNotificationSettings: userActions.getNotificationSettings,
})(NotificationsBlock);
