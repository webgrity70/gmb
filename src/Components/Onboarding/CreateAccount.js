import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Form, Button } from 'semantic-ui-react';
import onboarding_service from '../../Services/OnboardingService';
import Registered from '../Pages/Registered';
import Helpers from '../Utils/Helpers';

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      passwordError: false,
      registered: false,
      registering: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  validateForm = (event) => {
    event.preventDefault();
    this.setState({ registering: true });
    const user_data = this.props.data;

    const that = this;
    if (this.state.email === undefined || this.state.email.trim() === '') {
      toast.error('Please fill out all fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      this.setState({ emailError: true, registering: false });
      return;
    }
    if (
      this.state.password === undefined ||
      this.state.password.trim() === '' ||
      this.state.passwordConfirm === undefined ||
      this.state.passwordConfirm.trim() === ''
    ) {
      toast.error('Please fill out all fields!', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      this.setState({ passwordError: true, registering: false });
      return;
    }
    if (this.state.password !== this.state.passwordConfirm) {
      toast.error('Your passwords do not match', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      this.setState({ passwordError: true, registering: false });
      return;
    }
    user_data.email = this.state.email;
    user_data.password = this.state.password;
    onboarding_service
      .userExists(user_data.email)
      .then((data) => {
        if (data.status === 'success') {
          onboarding_service
            .userRegister(user_data)
            .then((data) => {
              Helpers.createToast(data);
              that.setState({ registered: true, registering: false });
            })
            .catch((data) => {
              Helpers.createToast(data);
              that.setState({ registered: false, registering: false });
            });
        }
      })
      .catch((data) => {
        Helpers.createToast(data);
        that.setState({ emailError: true, registering: false });
      });
  };

  handleChange(event) {
    const key = event.target.id;
    if (key === 'email') this.setState({ email: event.target.value });
    else if (key === 'password')
      this.setState({ password: event.target.value, passwordError: false });
    else if (key === 'password-confirm') {
      this.setState({
        passwordConfirm: event.target.value,
        passwordError: false,
      });
    }
  }

  render() {
    if (this.state.registered) return <Registered />;
    return (
      <div>
        <h4>Become a buddy!</h4>
        <Form className="form-horizontal" onSubmit={this.validateForm}>
          <Form.Field inline>
            <label>Email</label>
            <Input
              id="email"
              type="email"
              className="form-control"
              name="email"
              value={this.state.email}
              onChange={this.handleChange}
              autoFocus
            />
          </Form.Field>
          <Form.Field inline>
            <label>Password</label>
            <Input
              id="password"
              type="password"
              className="form-control"
              name="password"
              data-private
              value={this.state.password}
              onChange={this.handleChange}
              error={!!this.state.passwordError}
            />
          </Form.Field>
          <Form.Field inline>
            <label>Confirm Password</label>
            <Input
              id="password-confirm"
              type="password"
              className="form-control"
              name="password_confirmation"
              data-private
              value={this.state.passwordConfirm}
              onChange={this.handleChange}
              error={!!this.state.passwordError}
            />
          </Form.Field>
          {this.state.registering ? (
            <Button type="submit" color="orange" disabled>
              Registering...
            </Button>
          ) : (
            <Button type="submit" color="orange">
              Register
            </Button>
          )}
        </Form>
      </div>
    );
  }
}

export default CreateAccount;
