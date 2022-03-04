import React from 'react';
import * as PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import OptionLabelComponent from './OptionLabelComponent';
import OptionCheckboxComponent from './OptionCheckboxComponent';
import TurnAllComponent from './TurnAllComponent';

const propTypes = {
  title: PropTypes.string.isRequired,
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
        })
      ),
    })
  ).isRequired,
  editing: PropTypes.bool.isRequired,
  updateSettings: PropTypes.func.isRequired,
  profileVisibility: PropTypes.bool.isRequired,
  changeProfileVisibility: PropTypes.func.isRequired,
};

class PrivacyGroup extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(e, element) {
    const { updateSettings } = this.props;
    updateSettings(element.setting, element.name, !element.checked);
  }

  render() {
    const {
      title,
      notificationSettings,
      editing,
      profileVisibility,
      changeProfileVisibility,
    } = this.props;
    const notificationSettingLength = notificationSettings
      ? notificationSettings.length
      : 1;
    return (
      <Grid.Column
        mobile={16}
        tablet={16}
        computer={16}
        className="notifications-content"
      >
        <div className="group-header">
          <h3>{title}</h3>
          <TurnAllComponent
            onText="Invisible"
            offText="Visible"
            editing={editing}
            checked={!profileVisibility}
            onChange={changeProfileVisibility}
            dataTooltip="Your profile can still be seen, but will be invisible in search"
            includeLegend
          />
        </div>
        <Grid
          columns={notificationSettingLength}
          stackable
          className="notification-settings"
        >
          <Grid.Row>
            {notificationSettings &&
              notificationSettings.map((setting) => (
                <Grid.Column className="notification-setting" key={setting.key}>
                  <h3>{setting.label}</h3>
                  <Grid>
                    <Grid.Row centered>
                      {setting.options &&
                        setting.options.map((option) => (
                          <React.Fragment key={option.key}>
                            <OptionLabelComponent label={option.label} />
                            <OptionCheckboxComponent
                              value={!option.value}
                              setting={setting.key}
                              name={option.key}
                              editing={editing}
                              onChange={this.handleToggle}
                              onText="Private"
                              offText="Public"
                              onEditText="Private"
                              offEditText="Public"
                            />
                          </React.Fragment>
                        ))}
                      <small className="muted">{setting.description}</small>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              ))}
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  }
}

PrivacyGroup.propTypes = propTypes;

export default PrivacyGroup;
