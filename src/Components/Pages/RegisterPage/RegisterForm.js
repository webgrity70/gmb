import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Container,
  Divider,
  Form,
  Grid,
  Icon,
  Checkbox,
} from 'semantic-ui-react';
import moment from 'moment';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { Link } from 'react-router-dom';
import ajax from '../../../Services/LoginService';
import onboarding_service from '../../../Services/OnboardingService';
import ProfileService from '../../../Services/ProfileService';
import Helpers from '../../Utils/Helpers';

class RegisterPage extends Component {
  responseFacebook = (response) => {
    // TODO: Why is it not using redux?
    const facebookToken = response.accessToken;

    const that = this;
    if (facebookToken) {
      ajax
        .convertToken('facebook', facebookToken)
        .then((data) => {
          /** @namespace data.access_token */
          /** @namespace data.refresh_token */
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem(
            'expires',
            moment().add(data.expires_in, 'seconds').format()
          );
          return ProfileService.getProfile();
        })
        .then((data) => {
          that.props.updateUser(data);
          that.successNavigation();
        })
        .catch((data) => {
          /** @namespace data.error */
          /** @namespace data.error_description */
          toast.error(`Login failed. ${data.error_description || ''}`);
        });
    }
  };

  responseGoogle = (response) => {
    // TODO: Why is it not using redux?
    const googleToken = response.accessToken;

    const that = this;
    if (googleToken) {
      ajax
        .convertToken('google-oauth2', googleToken)
        .then((data) => {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem(
            'expires',
            moment().add(data.expires_in, 'seconds').format()
          );
          return ProfileService.getProfile();
        })
        .then((data) => {
          that.props.updateUser(data);
          that.successNavigation();
        })
        .catch((data) => {
          /** @namespace data.error */
          /** @namespace data.error_description */
          toast.error(`Login failed. ${data.error_description || ''}`);
        });
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      tosAccepted: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleTOSAcceptance = this.handleTOSAcceptance.bind(this);
  }

  handleTOSAcceptance() {
    const { tosAccepted } = this.state;
    this.setState({ tosAccepted: !tosAccepted });
  }

  setSignup(obj) {
    let { signupData } = this.props;
    signupData = { ...signupData, ...obj };

    this.props.setSignupData(signupData);
  }

  componentDidMount() {
    const that = this;
    ajax
      .getSocialIDs()
      .then((data) => {
        /** @namespace data.google */
        /** @namespace data.facebook */
        let { signupData } = that.props;
        signupData = {
          ...signupData,
          google_id: data.google,
          facebook_id: data.facebook,
        };
        that.props.setSignupData(signupData);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  validateForm = (event) => {
    event.preventDefault();
    let { signupData } = this.props;
    signupData = { ...signupData, registering: true };
    this.props.setSignupData(signupData);

    const user_data = {};

    const that = this;
    if (
      this.props.signupData.email === undefined ||
      this.props.signupData.email.trim() === ''
    ) {
      toast.error('Please fill out all fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      this.setSignup({ emailError: true, registering: false });
      return;
    }
    if (!this.validateEmail(this.props.signupData.email)) {
      toast.error('Email not valid!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      this.setSignup({ emailError: true, registering: false });
      return;
    }
    if (
      this.props.signupData.password === undefined ||
      this.props.signupData.password.trim() === '' ||
      this.props.signupData.passwordConfirm === undefined ||
      this.props.signupData.passwordConfirm.trim() === ''
    ) {
      toast.error('Please fill out all fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      this.setSignup({ passwordError: true, registering: false });
      return;
    }
    if (
      this.props.signupData.password !== this.props.signupData.passwordConfirm
    ) {
      toast.error('Your passwords do not match', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      this.setSignup({ passwordError: true, registering: false });
      return;
    }
    user_data.email = this.props.signupData.email;
    user_data.password = this.props.signupData.password;

    onboarding_service
      .userExists(user_data.email)
      .then((data) => {
        if (data.status === 'success') {
          that.handleForm('user_data', user_data);
        }
      })
      .catch((data) => {
        Helpers.createToast(data);
        that.setSignup({ emailError: true, registering: false });
      });
  };

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  handleChange(event) {
    const { signupData } = this.props;

    const key = event.target.id;
    if (key === 'email') {
      signupData.email = event.target.value.toLowerCase();
    } else if (key === 'password') {
      signupData.password = event.target.value;
      this.setSignup({ passwordError: false });
    } else if (key === 'password-confirm') {
      signupData.passwordConfirm = event.target.value;
      this.setSignup({
        passwordError: false,
      });
    }
    this.props.setSignupData(signupData);
  }

  handleForm(key, value) {
    let { signupData } = this.props;
    signupData = { ...signupData, ...value };

    this.props.setSignupData(signupData);
    this.props.nextStep();
  }

  sendPasswordResetRequest(event) {
    const that = this;
    event.preventDefault();
    const email = document.getElementById('email').value;
    ajax
      .sendPasswordReset(email)
      .then((data) => {
        Helpers.createToast(data);
        that.setSignup({
          reset_password_view: false,
          verification_code_view: false,
          reset_email: email,
          email,
        });
      })
      .catch((data) => {
        Helpers.createToast(data);
        that.setSignup({
          reset_password_view: true,
          verification_code_view: false,
          reset_email: email,
          email,
        });
      });
  }

  renderResetPassword() {
    if (this.props.signupData.reset_password_view) {
      return (
        <div>
          <h2 className="resetPasswordHeader">Reset Password</h2>
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
            <Form.Field style={{ textAlign: 'center' }}>
              <Form.Button color="twitter">Reset Password</Form.Button>
            </Form.Field>
          </Form>
        </div>
      );
    }
    return <div />;
  }

  render() {
    const { tosAccepted } = this.state;
    return (
      <div
        className="login-container register"
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
                    this.props.signupData.reset_password_view ||
                    this.props.signupData.verification_code_view
                      ? 'none'
                      : '',
                }}
              >
                <h2 className="login_title">Sign Up</h2>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Field>
                    <input
                      id="email"
                      placeholder="Email"
                      type="email"
                      className={`form-control data-hj-whitelist ${
                        this.props.signupData.displayLoginErrors && 'is-invalid'
                      }`}
                      name="email"
                      value={this.props.signupData.email}
                      onChange={this.handleChange}
                      required
                      autoFocus
                    />
                  </Form.Field>
                  <Form.Field>
                    <input
                      id="password"
                      type="password"
                      placeholder="Password"
                      className={`form-control ${
                        this.props.signupData.displayLoginErrors && 'is-invalid'
                      }`}
                      name="password"
                      value={this.props.signupData.password}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Field>
                  <Form.Field>
                    <input
                      id="password-confirm"
                      type="password"
                      placeholder="Confirm Password"
                      className={`form-control ${
                        this.props.signupData.displayLoginErrors &&
                        this.props.signupData.password_valid &&
                        'is-invalid'
                      }`}
                      name="passwordconfirm"
                      value={this.props.signupData.passwordconfirm}
                      onChange={this.handleChange}
                      required
                      data-private
                    />
                  </Form.Field>
                  <div className="text-center">
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
                  <Form.Field className="login_button_container">
                    <Form.Button
                      color="twitter"
                      className="login_button"
                      onClick={this.validateForm}
                      disabled={!tosAccepted}
                    >
                      Sign Up
                    </Form.Button>
                  </Form.Field>
                  {(this.props.signupData.facebook_id ||
                    this.props.signupData.google_id) && (
                    <React.Fragment>
                      <Divider horizontal>Or</Divider>
                      <div className="login_methods">
                        {this.props.signupData.facebook_id && (
                          <FacebookLogin
                            appId={this.props.signupData.facebook_id}
                            autoLoad={false}
                            textButton={
                              <div>
                                {' '}
                                <i className="fa fa-facebook" /> Sign up with
                                Facebook{' '}
                              </div>
                            }
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="ui facebook button"
                          />
                        )}
                        {this.props.signupData.google_id && (
                          <GoogleLogin
                            clientId={this.props.signupData.google_id}
                            autoLoad={false}
                            buttonText={
                              <div>
                                {' '}
                                <i className="fa fa-google" /> Sign up with
                                Google{' '}
                              </div>
                            }
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            className="ui google plus button"
                          />
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </Form>
              </div>
              <p className="login text-center">
                Already have an account? <Link to="/"> Log In </Link>
              </p>
            </Container>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { signupData } = state;
  return {
    signupData,
  };
};

export default connect(mapStateToProps, null)(RegisterPage);
