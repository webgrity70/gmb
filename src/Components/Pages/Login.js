/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { Container, Divider, Form, Grid, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import LogRocket from 'logrocket';
import { toast } from 'react-toastify';
import GoogleLogin from 'react-google-login';
import * as qs from 'qs/lib';
import { Link } from 'react-router-dom';
import ajax from '../../Services/LoginService';
import * as profileActions from '../../Actions/actions_profile';
import * as userActions from '../../Actions/actions_user';
import Helpers from '../Utils/Helpers';
import { TrackEvent } from '../../Services/TrackEvent';
import { Identify } from '../../Services/Identify';

class Login extends Component {
  responseFacebook = async (response) => {
    const facebookToken = response.accessToken;
    const that = this;
    if (facebookToken) {
      ajax
        .convertToken('facebook', facebookToken)
        .then(async (data) => {
          /** @namespace data.access_token */
          /** @namespace data.refresh_token */
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem(
            'expires',
            moment().add(data.expires_in, 'seconds').format()
          );
          TrackEvent('login-facebook');
          try {
            const {
              fetchUserInformation,
              fetchUserPreferences,
              fetchUserAbout,
              fetchUserCategories,
              updateUser,
              history,
              fetchUserData,
              fetchUserSubscription,
            } = that.props;
            const userData = await fetchUserData();
            updateUser(userData, false, true);
            const res = await Promise.all([
              fetchUserPreferences(userData.pk),
              fetchUserCategories(userData.pk),
              fetchUserAbout(userData.pk),
              fetchUserInformation(userData.pk),
              fetchUserSubscription(userData.pk),
            ]);
            Identify(userData, {
              subscription: res[4],
            });
            const profileReady = this.isProfileCompleted([...res, userData]);
            if (profileReady) that.successNavigation();
            else history.push('/profile');
          } catch (e) {
            toast.error(`Login failed. ${e.error_description || ''}`);
          }
        })
        .catch((data) => {
          /** @namespace data.error */
          /** @namespace data.error_description */
          toast.error(`Login failed. ${data.error_description || ''}`);
        });
    }
  };

  responseGoogle = async (response) => {
    const googleToken = response.accessToken;

    const that = this;
    if (googleToken) {
      try {
        const data = await ajax.convertToken('google-oauth2', googleToken);
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem(
          'expires',
          moment().add(data.expires_in, 'seconds').format()
        );
        TrackEvent('login-google');
        const {
          fetchUserInformation,
          fetchUserPreferences,
          fetchUserAbout,
          fetchUserCategories,
          updateUser,
          history,
          fetchUserData,
          fetchUserSubscription,
        } = that.props;
        const userData = await fetchUserData();
        updateUser(userData, false, true);
        const res = await Promise.all([
          fetchUserPreferences(userData.pk),
          fetchUserCategories(userData.pk),
          fetchUserAbout(userData.pk),
          fetchUserInformation(userData.pk),
          fetchUserSubscription(userData.pk),
        ]);
        Identify(userData, {
          subscription: res[4],
        });
        const profileReady = this.isProfileCompleted([...res, userData]);
        if (profileReady) that.successNavigation();
        else history.push('/profile');
      } catch (e) {
        toast.error(`Login failed. ${e.error_description || ''}`);
      }
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      google_id: null,
      facebook_id: null,
      email: '',
      password: '',
      value: '',
      reset_password_view: false,
      verification_code_view: false,
      reset_email: '',
      // remember: !!localStorage.getItem('remember-me'),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendPasswordResetRequest = this.sendPasswordResetRequest.bind(this);
    this.successNavigation = this.successNavigation.bind(this);
    const that = this;
    ajax
      .getSocialIDs()
      .then((data) => {
        /** @namespace data.google */
        /** @namespace data.facebook */
        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        if (that._mounted) {
          that.setState({
            google_id: data.google,
            facebook_id: data.facebook,
          });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  successNavigation() {
    const parsed = qs.parse(
      this.props.location.search.slice(1, this.props.location.search.length)
    );
    let url = '/dashboard';
    if ('redirect' in parsed) url = parsed.redirect;
    this.props.history.push(url);
  }

  sendPasswordResetRequest(event) {
    const that = this;
    event.preventDefault();
    const email = document.getElementById('email').value;
    ajax
      .sendPasswordReset(email)
      .then((data) => {
        Helpers.createToast(data);
        that.setState({
          reset_password_view: false,
          verification_code_view: false,
          reset_email: email,
          email,
        });
      })
      .catch((data) => {
        Helpers.createToast(data);
        that.setState({
          reset_password_view: true,
          verification_code_view: false,
          reset_email: email,
          email,
        });
      });
  }

  handleChange(event) {
    const key = event.target.id;

    if (key === 'email') {
      this.setState({
        email: event.target.value,
      });
    } else if (key === 'password') {
      this.setState({
        password: event.target.value,
      });
    } else {
      this.setState({
        value: event.target.value,
      });
    }
  }

  UNSAFE_componentWillMount() {
    if (Object.keys(this.props.user).length > 0) {
      this.successNavigation();
    } else {
      this.props.updateUser(false, false, true);
    }
    // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._mounted = true;
  }

  componentWillUnmount() {
    // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._mounted = false;
  }

  isProfileCompleted = (data) => {
    const [preferences, categories, about, information, , profile] = data;
    const aboutReady = !!about.about;
    const foodReady = !!about.favoriteFood;
    const locationReady = !!information.location;
    const preferencesReady = !!preferences.meetingPreference;
    const occupationReady = about.occupation;
    const weaknessReady = !!about.weakness;
    const languagesReady = information && information.languages.length > 0;
    const strengthReady = !!about.strength;
    const birthdayReady = !!profile.date_of_birth;
    const nameReady = !!information.name;
    const categoriesReady =
      categories && categories.filter((e) => e.active).length > 0;
    if (
      aboutReady &&
      foodReady &&
      locationReady &&
      preferencesReady &&
      occupationReady &&
      weaknessReady &&
      languagesReady &&
      strengthReady &&
      birthdayReady &&
      nameReady &&
      categoriesReady
    ) {
      return true;
    }
    return false;
  };

  /* onChangeRemember = () => {
    const { remember } = this.state;
    if (remember) {
      localStorage.removeItem('remember-me');
    } else {
      localStorage.setItem('remember-me', true);
    }
    this.setState(prevState => ({
      remember: !prevState.remember,
    }));
  };
  */

  handleSubmit(event) {
    const that = this;
    this.setState({ displayLoginErrors: false });
    ajax
      .login(this.state.email, this.state.password)
      .then(async (data) => {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem(
          'expires',
          moment().add(data.expires_in, 'seconds').format()
        );
        TrackEvent('login');
        try {
          const {
            fetchUserInformation,
            fetchUserPreferences,
            fetchUserAbout,
            fetchUserCategories,
            fetchUserSubscription,
            updateUser,
            history,
            fetchUserData,
          } = that.props;
          const userData = await fetchUserData();
          updateUser(userData, false, true);
          const res = await Promise.all([
            fetchUserPreferences(userData.pk),
            fetchUserCategories(userData.pk),
            fetchUserAbout(userData.pk),
            fetchUserInformation(userData.pk),
            fetchUserSubscription(userData.pk),
          ]);
          Identify(userData, {
            subscription: res[4],
          });
          const profileReady = this.isProfileCompleted([...res, userData]);
          if (profileReady) that.successNavigation();
          else history.push('/profile');
        } catch (e) {
          toast.error(`Login failed. ${e.error_description || ''}`);
        }
      })
      .catch((error) => {
        toast.error(`Invalid credentials. ${error.error_description || ''}`);
        that.setState({ displayLoginErrors: true });
      });

    event.preventDefault();
  }

  renderResetPassword() {
    if (this.state.reset_password_view) {
      return (
        <div>
          <h2
            style={{
              textAlign: 'center',
              width: '100%',
              marginTop: '20px',
              marginBottom: '20px',
            }}
          >
            Reset Password
          </h2>
          <Form onSubmit={this.sendPasswordResetRequest}>
            <Form.Field>
              <label>E-Mail Address</label>
              <input
                id="email"
                type="email"
                className="form-control data-hj-whitelist"
                name="email"
                onChange={this.handleChange}
                required
                autoFocus
              />
            </Form.Field>
            <Form.Field style={{ textAlign: 'center', marginTop: '30px' }}>
              <Form.Button color="twitter">Reset Password</Form.Button>
            </Form.Field>
          </Form>
        </div>
      );
    }
    return <div />;
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="login-container login"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Grid centered>
            <Grid.Column mobile={16} tablet={6} computer={6}>
              <Container>
                {this.renderResetPassword()}
                <div
                  style={{
                    display:
                      this.state.reset_password_view ||
                      this.state.verification_code_view
                        ? 'none'
                        : '',
                  }}
                >
                  <h2
                    style={{
                      textAlign: 'center',
                      width: '100%',
                      marginBottom: '20px',
                    }}
                    className="login_title"
                  >
                    Login
                  </h2>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                      <input
                        id="email"
                        placeholder="Email"
                        type="email"
                        className={`form-control data-hj-whitelist ${
                          this.state.displayLoginErrors && 'is-invalid'
                        }`}
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                        autoFocus
                      />
                    </Form.Field>
                    <Form.Field>
                      <input
                        id="password"
                        type="password"
                        data-private
                        placeholder="Password"
                        className={`form-control ${
                          this.state.displayLoginErrors && 'is-invalid'
                        }`}
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                      />
                    </Form.Field>
                    {/* <Form.Field>
                      <Checkbox
                        label="Remember me"
                        onChange={this.onChangeRemember}
                        checked={this.state.remember}
                      />
                    </Form.Field> */}
                    <div className="login_button_container">
                      <Form.Button color="twitter" className="login_button">
                        Login <Icon name="angle right" />
                      </Form.Button>
                      <div className="forgot_password">
                        <a
                          onClick={() =>
                            this.setState({ reset_password_view: true })
                          }
                        >
                          Forgot your password?
                        </a>
                      </div>
                    </div>
                    {(this.state.facebook_id || this.state.google_id) && (
                      <React.Fragment>
                        <Divider horizontal>Or</Divider>
                        <div
                          style={{ textAlign: 'center' }}
                          className="login_methods"
                        >
                          {this.state.facebook_id && (
                            <FacebookLogin
                              appId={this.state.facebook_id}
                              autoLoad={false}
                              textButton={
                                <div>
                                  {' '}
                                  <i className="fa fa-facebook" />
                                  Login with Facebook
                                </div>
                              }
                              fields="name,email,picture"
                              callback={this.responseFacebook}
                              cssClass="ui facebook button"
                              style={{}}
                            />
                          )}
                          {this.state.google_id && (
                            <GoogleLogin
                              clientId={this.state.google_id}
                              autoLoad={false}
                              buttonText={
                                <div>
                                  {' '}
                                  <i className="fa fa-google" /> Login with
                                  Google{' '}
                                </div>
                              }
                              onSuccess={this.responseGoogle}
                              onFailure={this.responseGoogle}
                              className="ui google plus button"
                              style={{}}
                            />
                          )}
                        </div>
                      </React.Fragment>
                    )}
                  </Form>
                </div>
                <p className="register text-center">
                  Don't have an account? <Link to="/register"> Sign up </Link>
                </p>
              </Container>
            </Grid.Column>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, {
  fetchUserData: userActions.fetchUserData,
  fetchUserInformation: profileActions.fetchUserInformation,
  fetchUserAbout: profileActions.fetchUserAbout,
  fetchUserPreferences: profileActions.fetchUserPreferences,
  fetchUserCategories: profileActions.fetchUserCategories,
  fetchUserSubscription: userActions.fetchUserSubscription,
})(Login);
