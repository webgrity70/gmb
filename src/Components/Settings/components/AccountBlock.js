/* global localStorage */
import React from 'react';
import { Button, Grid, Header, Input, Popup, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import 'react-dates/initialize';
// import { SingleDatePicker } from 'react-dates';
import Helpers from '../../Utils/Helpers';
import * as userActions from '../../../Actions/actions_user';
import { TrackEvent } from '../../../Services/TrackEvent';

const propTypes = {
  title: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  putOnHold: PropTypes.func,
  removeAccount: PropTypes.func,
  updateUser: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    password_changed: PropTypes.string,
  }).isRequired,
};

class AccountBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      loading: false,
      // onHoldFrom: null,
      // onHoldUntil: null,
      // onHoldFromFocus: false,
      // onHoldUntilFocus: false,
      password: '',
    };
    this.cancel = this.cancel.bind(this);
    this.edit = this.edit.bind(this);
    this.putOnHold = this.putOnHold.bind(this);
    this.removeAccount = this.removeAccount.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  updateValue = (e, value) => {
    const field = {};
    field[value.name] = value.value;
    this.setState(field);
  };

  cancel() {
    this.setState({ editing: false });
  }

  edit() {
    this.setState({ editing: true });
  }

  removeAccount() {
    const { removeAccount, updateUser, history } = this.props;
    const { password } = this.state;
    this.setState({ loading: true });
    removeAccount(password)
      .then((data) => {
        Helpers.createToast(data);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        updateUser();
        TrackEvent('settings-security-deleted-account');
        history.push('/login');
        this.setState({ loading: false });
      })
      .catch((data) => {
        Helpers.createToast(data);
        this.setState({ loading: false });
      });
  }

  putOnHold() {
    const { putOnHold, updateUser } = this.props;
    const { onHoldFrom, onHoldUntil } = this.state;
    this.setState({ loading: true });
    putOnHold(onHoldFrom, onHoldUntil)
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
    const { title, editable } = this.props;
    const {
      editing,
      password,
      loading,
      // onHoldFrom, onHoldFromFocus, onHoldUntil, onHoldUntilFocus,
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
            className="settings-content account-block"
          >
            <Segment basic loading={loading}>
              {editing ? (
                // Editing
                <Grid stackable>
                  {/* <Grid.Column mobile={16} className="d-inline-flex"> */}
                  {/* <div className="label">Put account on hold</div> */}
                  {/* <div className="value"> */}
                  {/* <div className="date-block"> */}
                  {/* <div className="label"> */}
                  {/* From */}
                  {/* </div> */}
                  {/* <SingleDatePicker */}
                  {/* placeholder="From" */}
                  {/* showDefaultInputIcon */}
                  {/* date={onHoldFrom} */}
                  {/* onDateChange={date => this.setState({ onHoldFrom: date })} */}
                  {/* focused={onHoldFromFocus} */}
                  {/* onFocusChange={() => this.setState({ */}
                  {/* onHoldFromFocus: !onHoldFromFocus, */}
                  {/* })} */}
                  {/* id="on_hold_from" */}
                  {/* /> */}
                  {/* </div> */}
                  {/* <div className="date-block"> */}
                  {/* <div className="label"> */}
                  {/* Until */}
                  {/* </div> */}
                  {/* <SingleDatePicker */}
                  {/* date={onHoldUntil} */}
                  {/* showDefaultInputIcon */}
                  {/* onDateChange={date => this.setState({ onHoldUntil: date })} */}
                  {/* focused={onHoldUntilFocus} */}
                  {/* onFocusChange={() => this.setState({ */}
                  {/* onHoldUntilFocus: !onHoldUntilFocus, */}
                  {/* })} */}
                  {/* id="on_hold_until" */}
                  {/* /> */}
                  {/* </div> */}
                  {/* </div> */}
                  {/* </Grid.Column> */}
                  <Grid.Column mobile={16} className="d-inline-flex">
                    <div className="label">Delete account permanently</div>
                    <div className="value">
                      <Input
                        type="password"
                        placeholder="Type your password"
                        value={password}
                        onChange={this.updateValue}
                        name="password"
                      />
                      <Popup
                        trigger={
                          <Button
                            negative
                            icon="info circle"
                            content="Delete permanently"
                            onClick={this.removeAccount}
                          />
                        }
                        position="top center"
                      >
                        <Popup.Content>
                          <React.Fragment>
                            This action is <strong>irreversible.</strong>
                          </React.Fragment>
                        </Popup.Content>
                      </Popup>
                    </div>
                  </Grid.Column>
                </Grid>
              ) : (
                // Viewing
                <Grid centered className="my-2">
                  From this section you can delete your account if you wish.
                </Grid>
              )}
            </Segment>
          </Grid.Column>
          <hr className="settings-bottom" />
          {editable ? (
            <div className="actions">
              <ul>
                {!editing ? (
                  <li>
                    {/* <button type="button" onClick={this.edit}>Put account on hold</button> */}
                    <Button onClick={this.edit}>Delete Account</Button>
                  </li>
                ) : null}
                {editing ? (
                  <React.Fragment>
                    <li>
                      <Button onClick={this.cancel}>Cancel</Button>
                    </li>
                    {/* <li> */}
                    {/* <button type="button" onClick={this.putOnHold}>Put on hold</button> */}
                    {/* </li> */}
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

AccountBlock.propTypes = propTypes;

export default connect(null, {
  putOnHold: userActions.putOnHoldAcc,
  removeAccount: userActions.removeAccount,
})(AccountBlock);
