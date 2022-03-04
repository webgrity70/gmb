/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';
import { connect } from 'react-redux';
import BEMHelper from 'react-bem-helper';
import { Container, Segment, Checkbox, Form, Input } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import Helpers from '../../Utils/Helpers';
import LoginService from '../../../Services/LoginService';
import { TrackEvent } from '../../../Services/TrackEvent';
import { Identify } from '../../../Services/Identify';
import * as userActions from '../../../Actions/actions_user';
import * as profileActions from '../../../Actions/actions_profile';
import './BetaInvitation.scss';

const bem = BEMHelper({ name: 'BetaInvitation', outputIsString: true });

const STATUS = {
  ERROR: 'error',
};

class BetaInvitation extends Component {
  constructor(props) {
    super(props);
    const { match } = props;
    this.state = {
      hash: match.params.hash,
      password: '',
      passwordConfirm: '',
      passwordError: false,
      finished: false,
      tosAccepted: false,
    };
  }

  componentDidMount = async () => {
    const { user, history, match } = this.props;
    if (user.pk) history.push('/profile');
    try {
      await LoginService.verifyHash(match.params.hash);
    } catch (e) {
      if (e.status === STATUS.ERROR) {
        history.push('/login');
      }
    }
  };

  handleChange = (e) => {
    const data = {};
    data[e.target.id] = e.target.value;
    data.passwordError = false;
    this.setState(data);
  };

  handleTOSAcceptance = () => {
    const { tosAccepted } = this.state;
    this.setState({ tosAccepted: !tosAccepted });
  };

  resetPassword = (e) => {
    e.preventDefault();
    const {
      updateUser,
      history,
      fetchUserData,
      fetchUserSubscription,
      fetchUserInformation,
      fetchUserPreferences,
      fetchUserCategories,
      fetchUserAbout,
    } = this.props;
    const { hash, password, passwordConfirm, tosAccepted } = this.state;
    const valid = Helpers.validatePassword(password, passwordConfirm);
    if (valid !== true) {
      Helpers.createToast(valid);
      this.setState({ passwordError: true });
      return;
    }
    LoginService.createBetaPassword(hash, password, tosAccepted)
      .then(async (data) => {
        Helpers.createToast(data);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem(
          'expires',
          moment().add(data.expires_in, 'seconds').format()
        );
        localStorage.setItem('first_login', '1');
        TrackEvent('submitted-password');
        if (this._mounted) this.setState({ finished: true });
        const userData = await fetchUserData();
        await Promise.all([
          fetchUserPreferences(userData.pk),
          fetchUserAbout(userData.pk),
          fetchUserCategories(userData.pk),
        ]);
        await fetchUserInformation(userData.pk);
        const subscription = await fetchUserSubscription(userData.pk);
        Identify(userData, { subscription });
        updateUser(userData, false, true);
        history.push('/profile');
      })
      .catch((data) => {
        Helpers.createToast(data);
      });
  };

  render() {
    const {
      tosAccepted,
      passwordConfirm,
      password,
      passwordError,
      finished,
    } = this.state;
    const { history } = this.props;
    if (finished) return <Redirect to="/profile/" />;
    return (
      <div className={cx('login-container', bem())}>
        <Container>
          <Segment>
            <h2 className="login-container-h2">
              You have been invited to join the GetMotivatedBuddies beta!
            </h2>
            <p className="text-center">
              {' '}
              Your account is ready. Create a new password.{' '}
            </p>
            <div className="mb-30">
              <div className="">
                <Form className="form-horizontal" onSubmit={this.resetPassword}>
                  <Form.Field inline>
                    <label>Password</label>
                    <Input
                      id="password"
                      value={password}
                      type="password"
                      className="form-control"
                      name="password"
                      required
                      onChange={this.handleChange}
                      error={!!passwordError}
                    />
                  </Form.Field>
                  <Form.Field inline>
                    <label className="m-top-10">Confirm Password</label>
                    <Input
                      id="passwordConfirm"
                      value={passwordConfirm}
                      type="password"
                      data-private
                      name="password"
                      required
                      onChange={this.handleChange}
                      error={!!passwordError}
                    />
                  </Form.Field>

                  <div className={cx('text-center', bem('terms'))}>
                    <Checkbox
                      onClick={this.handleTOSAcceptance}
                      checked={tosAccepted}
                      required
                      label="I have read and agree to the "
                    />
                    <span>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.getmotivatedbuddies.com/terms/"
                      >
                        {' '}
                        Terms of Service{' '}
                      </a>{' '}
                      and
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.getmotivatedbuddies.com/privacy/"
                      >
                        {' '}
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </div>
                  <div className={bem('accident')}>
                    <span>
                      Here by accident? Click here to
                      <a onClick={() => history.push('/register')}>Sign Up</a>
                    </span>
                  </div>
                  <div
                    className={cx('form-group mb-30 text-center', bem('join'))}
                  >
                    <button
                      style={{ cursor: 'pointer' }}
                      disabled={!tosAccepted}
                      type="submit"
                      className="ui orange button"
                    >
                      Click to Join
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </Segment>
        </Container>
      </div>
    );
  }
}

BetaInvitation.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
  history: PropTypes.shape(),
  match: PropTypes.shape(),
  updateUser: PropTypes.func,
  fetchUserData: PropTypes.func,
  fetchUserInformation: PropTypes.func,
  fetchUserAbout: PropTypes.func,
  fetchUserPreferences: PropTypes.func,
  fetchUserCategories: PropTypes.func,
  fetchUserSubscription: PropTypes.func,
};

export default connect(null, {
  fetchUserSubscription: userActions.fetchUserSubscription,
  fetchUserData: userActions.fetchUserData,
  fetchUserInformation: profileActions.fetchUserInformation,
  fetchUserAbout: profileActions.fetchUserAbout,
  fetchUserPreferences: profileActions.fetchUserPreferences,
  fetchUserCategories: profileActions.fetchUserCategories,
})(BetaInvitation);
