import React from 'react';
import get from 'lodash/get';
import { Grid, Header, Segment, Icon, Button } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helpers from '../../Utils/Helpers';
import * as userActions from '../../../Actions/actions_user';
import PrivacyGroup from './PrivacyGroup';

const propTypes = {
  getPrivacySettings: PropTypes.func,
  updatePrivacySettings: PropTypes.func,
  title: PropTypes.string.isRequired,
  user: PropTypes.shape({
    invisible: PropTypes.bool,
  }).isRequired,
};

class PrivacyBlock extends React.Component {
  static updatePrivacyGroup(options, setting, element, value) {
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

  state = {
    privacyBasicOptions: [
      {
        key: 'privacy_basic',
        label: 'Basic information',
        options: [
          {
            key: 'age',
            label: 'Age',
            value: true,
          },
          {
            key: 'location',
            label: 'Location',
            value: false,
          },
          {
            key: 'groups',
            label: 'Groups',
            value: false,
          },
          {
            key: 'behaviour',
            label: 'Behavior to Reduce',
            value: false,
          },
          /* {
          key: 'apps',
          label: 'Apps',
          value: false,
        },
        {
          key: 'communication',
          label: 'Communication Preferences',
          value: false,
        }, */
        ],
      } /* {        key: 'privacy_habit',        label: 'Habit information',      options: [],    }, {      key: 'privacy_question',      label: 'Question information',      options: [],    } */,
    ],
    profileVisibility: true,
    loading: true,
    editing: false,
  };

  constructor(props) {
    super(props);
    this.cancel = this.cancel.bind(this);
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.updateBasicPrivacySettings = this.updateBasicPrivacySettings.bind(
      this
    );
    this.changeProfileVisibility = this.changeProfileVisibility.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.getSettings();
  }

  getSettings() {
    const { user, getPrivacySettings } = this.props;
    const { privacyBasicOptions } = this.state;
    this.setState({ loading: true });
    getPrivacySettings()
      .then((data) => {
        const newOptions = Object.keys(data.settings).map((setting) => {
          const fromState = privacyBasicOptions.find((e) => e.key === setting);
          return {
            ...fromState,
            options: fromState.options.map((opt) => ({
              ...opt,
              value: get(data.settings, `${setting}.${opt.key}`, opt.value),
            })),
          };
        });
        this.setState({
          privacyBasicOptions: newOptions,
          editing: false,
          profileVisibility: user.invisible,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

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

  save() {
    const { updatePrivacySettings } = this.props;
    const { privacyBasicOptions, profileVisibility } = this.state;
    const options = [privacyBasicOptions];
    this.setState({ loading: true });
    updatePrivacySettings(options, profileVisibility)
      .then((data) => {
        Helpers.createToast(data);
        this.setState({ loading: false });
      })
      .catch((data) => {
        Helpers.createToast(data);
        this.setState({ loading: false });
      });
    this.setState({ editing: false });
  }

  edit() {
    this.setState({ editing: true });
  }

  updateBasicPrivacySettings(setting, element, value) {
    const { privacyBasicOptions } = this.state;
    const opt = PrivacyBlock.updatePrivacyGroup(
      privacyBasicOptions,
      setting,
      element,
      value
    );
    this.setState({ privacyBasicOptions: opt });
  }

  changeProfileVisibility(e, element) {
    this.setState({ profileVisibility: !element.checked });
  }

  render() {
    const { title } = this.props;
    const {
      editing,
      privacyBasicOptions,
      profileVisibility,
      loading,
    } = this.state;
    return (
      <Segment fluid className="settings-block">
        <Header as="h2" className="settings-block-title">
          {title}
        </Header>
        <Grid>
          <Segment basic loading={loading}>
            <PrivacyGroup
              title="Profile Visibility"
              notificationSettings={privacyBasicOptions}
              editing={editing}
              updateSettings={this.updateBasicPrivacySettings}
              profileVisibility={profileVisibility}
              changeProfileVisibility={this.changeProfileVisibility}
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
                    className="orange-color"
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

PrivacyBlock.propTypes = propTypes;

export default connect(null, {
  updatePrivacySettings: userActions.updatePrivacySettings,
  getPrivacySettings: userActions.getPrivacySettings,
})(PrivacyBlock);
