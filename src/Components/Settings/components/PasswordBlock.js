import React from 'react';
import { Grid, Header, Input, Segment, Icon, Button } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { changePassword as changePasswordAction } from '../../../Actions/actions_user';
import Helpers from '../../Utils/Helpers';

const propTypes = {
  title: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  updateUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    password_changed: PropTypes.string,
  }).isRequired,
};

class PasswordBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      loading: false,
    };
    this.cancel = this.cancel.bind(this);
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  updateValue = (e, value) => {
    const field = {};
    field[value.name] = value.value;
    this.setState(field);
  };

  cancel() {
    this.setState({
      editing: false,
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    });
  }

  edit() {
    this.setState({ editing: true });
  }

  save() {
    const { changePassword, updateUser } = this.props;
    const { currentPassword, newPassword, newPasswordConfirm } = this.state;
    const validation = Helpers.validatePassword(
      newPassword,
      newPasswordConfirm
    );
    if (validation !== true) {
      Helpers.createToast(validation);
      return;
    }
    this.setState({ loading: true });
    changePassword(currentPassword, newPassword)
      .then((data) => {
        Helpers.createToast(data);
        updateUser();
        this.setState({ editing: false, loading: false });
      })
      .catch((data) => {
        if (data.message !== undefined) {
          Helpers.createToast(data);
        } else {
          Helpers.createToast({
            status: 'error',
            message: 'Something went wrong.',
          });
        }
        this.setState({ editing: false, loading: false });
      });
  }

  render() {
    const { title, editable, user } = this.props;
    const {
      editing,
      currentPassword,
      newPassword,
      newPasswordConfirm,
      loading,
    } = this.state;
    return (
      <Segment fluid className="settings-block">
        <Header as="h2" className="settings-block-title">
          {title}
        </Header>
        <Grid>
          <Grid.Column
            mobile={16}
            tablet={16}
            computer={16}
            className="settings-content"
          >
            <Segment basic loading={loading}>
              {editing ? (
                // Editing
                <Grid columns={2} stackable>
                  <Grid.Column>
                    <div className="label">Password</div>
                    <Input
                      className="mw-100"
                      type="password"
                      value={currentPassword}
                      onChange={this.updateValue}
                      name="currentPassword"
                      placeholder="Enter your current password"
                      data-private
                    />
                  </Grid.Column>
                  <Grid.Column>
                    <Grid.Row>
                      <Input
                        className="mw-100"
                        type="password"
                        value={newPassword}
                        onChange={this.updateValue}
                        name="newPassword"
                        placeholder="Enter your new password"
                        data-private
                      />
                    </Grid.Row>
                    <Grid.Row>
                      <Input
                        className="mw-100 mt-4"
                        type="password"
                        value={newPasswordConfirm}
                        onChange={this.updateValue}
                        name="newPasswordConfirm"
                        placeholder="Repeat your new password"
                        data-private
                      />
                    </Grid.Row>
                  </Grid.Column>
                </Grid>
              ) : (
                // Viewing
                <React.Fragment>
                  <div className="label">Password</div>
                  <span className="value">
                    Last updated{' '}
                    {user.password_changed
                      ? moment(user.password_changed).fromNow()
                      : 'Never'}
                  </span>
                </React.Fragment>
              )}
            </Segment>
          </Grid.Column>
          <hr className="settings-bottom" />
          {editable ? (
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
          ) : null}
        </Grid>
      </Segment>
    );
  }
}

PasswordBlock.propTypes = propTypes;

export default connect(null, { changePassword: changePasswordAction })(
  PasswordBlock
);
