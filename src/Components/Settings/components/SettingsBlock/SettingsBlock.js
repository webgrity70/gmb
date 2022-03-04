import React, { Component } from 'react';
import { Form, Grid, Header, Segment, Icon, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import cx from 'classnames';
import * as PropTypes from 'prop-types';
import { saveUserSettings as saveUserSettingsAction } from '../../../../Actions/actions_user';
import Setting from '../Setting';
import './SettingsBlock.scss';

const propTypes = {
  incomplete: PropTypes.bool,
  isValid: PropTypes.func,
  title: PropTypes.string.isRequired,
  settings: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
      single: PropTypes.bool,
    })
  ).isRequired,
  editable: PropTypes.bool.isRequired,
  saveUserSettings: PropTypes.func,
  updateUser: PropTypes.func.isRequired,
};
class SettingsBlock extends Component {
  state = { editing: false, settings: [], loading: false };

  constructor(props) {
    super(props);
    this.cancel = this.cancel.bind(this);
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { settings } = this.props;
    this.setState({ settings, originalSettings: JSON.stringify(settings) });
  }

  UNSAFE_componentWillReceiveProps(nextProps, _nextContent) {
    const { settings } = nextProps;
    this.setState({ settings, originalSettings: JSON.stringify(settings) });
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
    const { originalSettings } = this.state;
    this.setState({ editing: false, settings: JSON.parse(originalSettings) });
  }

  edit() {
    this.setState({ editing: true });
  }

  save() {
    const { saveUserSettings, updateUser } = this.props;
    const { settings } = this.state;
    const saveSettings = {};
    Object.keys(settings).forEach((item) => {
      if (settings[item].key) {
        saveSettings[settings[item].key] = settings[item].value;
      }
    });
    this.setState({ loading: true });
    saveUserSettings(saveSettings)
      .then(() => {
        updateUser();
        this.setState({
          editing: false,
          originalSettings: JSON.stringify(settings),
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          editing: false,
          originalSettings: JSON.stringify(settings),
          loading: false,
        });
      });
  }

  render() {
    const { title, editable, incomplete, isValid } = this.props;
    const { settings, editing, loading } = this.state;
    console.log(settings);
    return (
      <Segment fluid={'true'} className={cx('settings-block', { incomplete })}>
        <Header as="h2" className="settings-block-title">
          {title}
        </Header>
        <Grid>
          <Segment basic loading={loading} className="container-fluid">
            <Form>
              {settings.map((setting, i) => (
                <Setting
                  key={i} // eslint-disable-line react/no-array-index-key
                  settingKey={setting.key}
                  updateValue={this.updateValue}
                  editing={editing}
                  label={setting.label}
                  value={setting.value}
                  verified={setting.verified}
                  type={setting.type}
                  {...this.props}
                />
              ))}
            </Form>
          </Segment>
          {editable ? (
            <React.Fragment>
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
                        <Button
                          onClick={this.save}
                          color="orange"
                          disabled={isValid && !isValid(settings)}
                        >
                          Save
                        </Button>
                      </li>
                    </React.Fragment>
                  ) : null}
                </ul>
              </div>
            </React.Fragment>
          ) : null}
        </Grid>
      </Segment>
    );
  }
}

SettingsBlock.propTypes = propTypes;

export default connect(null, { saveUserSettings: saveUserSettingsAction })(
  SettingsBlock
);
