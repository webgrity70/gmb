import React, { Component } from 'react';

class Registered extends Component {
  render() {
    return (
      <div id="onboarding" className="onboarding_form active">
        <div className="flex_container">
          <div className="padded">
            <div className="heading" style={{ justifyContent: 'center' }}>
              <h4>Successfully registered!</h4>
            </div>
            <div className="description" style={{ justifyContent: 'center' }}>
              We have sent an email to you to activate your account. Please,
              follow the instructions given in that email.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Registered;
