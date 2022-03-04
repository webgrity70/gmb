import React from 'react';
import * as PropTypes from 'prop-types';
import { Grid, Menu } from 'semantic-ui-react';
import {
  AccountSettings,
  NotificationSettings,
  PrivacySettings,
  SecuritySettings,
  SubscriptionsSettings,
} from '../../Settings';
import { TrackEvent } from '../../../Services/TrackEvent';

import './Settings.scss';

const propTypes = {
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    name: PropTypes.string,
    date_of_birth: PropTypes.string,
    phone_number: PropTypes.string,
    google: PropTypes.string,
    facebook: PropTypes.string,
  }).isRequired,
};

const menuItems = {
  account: AccountSettings,
  notifications: NotificationSettings,
  privacy: PrivacySettings,
  security: SecuritySettings,
  subscriptions: SubscriptionsSettings,
};

class Settings extends React.Component {
  state = { settingsMode: 'account' };

  UNSAFE_componentWillMount() {
    const { match } = this.props;
    if (match.params.page) this.setState({ settingsMode: match.params.page });
  }

  handleMenuClick = (e, { name }) => {
    const { history } = this.props;
    this.setState({ settingsMode: name });
    if (name === 'subscriptions') {
      TrackEvent('settings-clicked-subscriptions');
    }
    history.push(`/settings/${name}`);
  };

  render() {
    const { settingsMode } = this.state;
    const CurrentPage = menuItems[settingsMode];
    return (
      <div className="SettingsPage">
        <Grid centered>
          <Grid.Column mobile={16} tablet={12} computer={10} largeScreen={8}>
            <h1 className="SettingsPage__title">Settings</h1>
            <Menu className="SettingsPage__menu" secondary>
              {Object.keys(menuItems).map((key) => (
                <Menu.Item
                  key={key}
                  name={key}
                  active={settingsMode === key}
                  onClick={this.handleMenuClick}
                />
              ))}
            </Menu>
            <CurrentPage {...this.props} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

Settings.propTypes = propTypes;

export default Settings;
