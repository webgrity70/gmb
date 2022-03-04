import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Divider, Form, Grid } from 'semantic-ui-react';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import AcceptTOS from './AcceptTOS';
import ajax from '../../../Services/LoginService';
import { handleChange, onSubmit } from '../../../Actions/signup';
import randomPassGenerator from '../../../utils/randomPassGenerator';

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleId: null,
      facebookId: null,
    };
    this.emailRef = React.createRef();
  }

  componentDidMount() {
    const { changeHandler } = this.props;
    const searchParam = new URLSearchParams(
      window.location.search.replace('+', '%2B')
    );
    const email = searchParam.get('email');
    const hosted_id = searchParam.get('hosted_id');
    const redirect_url = searchParam.get('redirect_url');

    if (email) {
      changeHandler(email, 'email');
      changeHandler(hosted_id, 'hosted_id');
    }
    if (redirect_url) {
      changeHandler(redirect_url, 'redirect_url');
    }

    ajax
      .getSocialIDs()
      .then((data) => {
        /** @namespace data.google */
        /** @namespace data.facebook */
        // TODO: Should not use _mounted. https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
        // eslint-disable-next-line no-underscore-dangle
        this.setState({
          googleId: data.google,
          facebookId: data.facebook,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  responseFacebook = async (response) => {
    if (!response.email || response.email === null) {
      toast.error('Signup with Facebook failed.');
      return;
    }
    const { changeHandler, submitHandler } = this.props;
    changeHandler(response.email, 'email');
    const password = randomPassGenerator();
    changeHandler(password, 'password');
    changeHandler(password, 'passwordconfirm');
    submitHandler();
  };

  responseGoogle = (response) => {
    if (response.error) {
      toast.error(`Signup with Google failed. ${response.details || ''}`);
      return;
    }
    const { changeHandler, submitHandler } = this.props;
    changeHandler(response.profileObj.email, 'email');
    const password = randomPassGenerator();
    changeHandler(password, 'password');
    changeHandler(password, 'passwordconfirm');
    submitHandler();
  };

  render() {
    const { signup, changeHandler, submitHandler } = this.props;

    const { googleId, facebookId, redirect_url } = this.state;

    const {
      email,
      password,
      passwordconfirm,
      tosAccepted,
      validating,
    } = signup.values;

    return (
      <div className="login-container register">
        <Grid centered>
          <Grid.Column mobile="16" tablet="10" computer="10">
            <Container className="login_column">
              <div>
                <h2 className="login_title">Sign Up</h2>
                <Form onSubmit={submitHandler}>
                  <Form.Field>
                    <input
                      id="email"
                      placeholder="Email"
                      type="email"
                      className="form-control data-hj-whitelist"
                      name="email"
                      value={email || ''}
                      onChange={(e) => changeHandler(e.target.value, 'email')}
                      ref={this.emailRef}
                      required
                      // eslint-disable-next-line jsx-a11y/no-autofocus
                      autoFocus
                    />
                  </Form.Field>
                  <Form.Field>
                    <input
                      id="password"
                      type="password"
                      placeholder="Password"
                      className="form-control "
                      name="password"
                      value={password || ''}
                      onChange={(e) =>
                        changeHandler(e.target.value, 'password')
                      }
                      required
                    />
                  </Form.Field>
                  <Form.Field>
                    <input
                      id="password-confirm"
                      type="password"
                      placeholder="Confirm Password"
                      className="form-control"
                      name="passwordconfirm"
                      data-private
                      value={passwordconfirm || ''}
                      onChange={(e) =>
                        changeHandler(e.target.value, 'passwordconfirm')
                      }
                      required
                    />
                  </Form.Field>
                  <Form.Field>
                    <input
                      id="redirect_url"
                      type="hidden"
                      name="redirect_url"
                      data-private
                      value={redirect_url || ''}
                    />
                  </Form.Field>

                  <div className="text-center terms">
                    {' '}
                    <AcceptTOS
                      handleChange={(e, { checked }) =>
                        changeHandler(checked, 'tosAccepted')
                      }
                      accepted={tosAccepted}
                    />{' '}
                  </div>

                  <Form.Field className="login_button_container">
                    <Form.Button
                      color="twitter"
                      className="login_button"
                      disabled={!tosAccepted || validating}
                    >
                      Sign Up
                    </Form.Button>
                  </Form.Field>

                  {(facebookId || googleId) && (
                    <React.Fragment>
                      <Divider horizontal>Or</Divider>
                      <div
                        style={{ textAlign: 'center' }}
                        className="login_methods"
                      >
                        {facebookId && (
                          <FacebookLogin
                            appId={facebookId}
                            autoLoad={false}
                            textButton={
                              <div>
                                {' '}
                                <i className="fa fa-facebook" />
                                Sign up with Facebook
                              </div>
                            }
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="ui facebook button"
                            style={{}}
                            isDisabled={!tosAccepted || validating}
                          />
                        )}
                        {googleId && (
                          <GoogleLogin
                            clientId={googleId}
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
                            style={{}}
                            disabled={!tosAccepted || validating}
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

RegisterForm.propTypes = {
  signup: PropTypes.shape({
    values: PropTypes.shape({
      email: PropTypes.string,
      password: PropTypes.string,
      passwordconfirm: PropTypes.string,
      redirect_url: PropTypes.string,
      tosAccepted: PropTypes.bool,
      validating: PropTypes.bool,
    }),
  }).isRequired,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  signup: state.signup,
});

export default connect(mapStateToProps, {
  changeHandler: handleChange,
  submitHandler: onSubmit,
})(RegisterForm);
