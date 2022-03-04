import React, { Component } from 'react';
import { Container, Segment, Form, Input } from 'semantic-ui-react';
import { Redirect } from 'react-router';
import Helpers from '../Utils/Helpers';
import login_service from '../../Services/LoginService';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: props.match.params.hash,
      password: '',
      passwordConfirm: '',
      passwordError: false,
      finished: false,
    };
  }

  handleChange = (event) => {
    const data = {};
    data[event.target.id] = event.target.value;
    data.passwordError = false;
    this.setState(data);
  };

  resetPassword(event) {
    event.preventDefault();
    const valid = Helpers.validatePassword(
      this.state.password,
      this.state.passwordConfirm
    );

    const that = this;
    if (valid !== true) {
      Helpers.createToast(valid);
      this.setState({ passwordError: true });
      return;
    }
    login_service
      .resetPassword(this.state.hash, this.state.password)
      .then((data) => {
        Helpers.createToast(data);
        that.setState({ finished: true });
      })
      .catch((data) => {
        Helpers.createToast(data);
      });
  }

  render() {
    if (this.state.finished) return <Redirect to="/login/" />;
    return (
      <div className="login-container">
        <Container
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Segment style={{ width: '100%' }}>
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
            <div className="mb-30">
              <div className="">
                <Form onSubmit={this.resetPassword.bind(this)}>
                  <Form.Field inline>
                    <label>Password</label>
                    <Input
                      id="password"
                      value={this.state.password}
                      type="password"
                      name="password"
                      required
                      onChange={this.handleChange}
                      error={!!this.state.passwordError}
                    />
                  </Form.Field>
                  <Form.Field inline>
                    <label>Confirm Password</label>
                    <Input
                      id="passwordConfirm"
                      value={this.state.passwordConfirm}
                      type="password"
                      name="password"
                      data-private
                      required
                      onChange={this.handleChange}
                      error={!!this.state.passwordError}
                    />
                  </Form.Field>
                  <div
                    style={{ marginTop: '20px' }}
                    className="form-group mb-30 text-center"
                  >
                    <button
                      style={{ cursor: 'pointer' }}
                      type="submit"
                      className="ui orange button"
                    >
                      Reset
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

export default ResetPassword;
