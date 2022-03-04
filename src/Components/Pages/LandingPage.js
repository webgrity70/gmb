import React, { Component } from 'react';
import { Redirect } from 'react-router';

class LandingPage extends Component {
  render() {
    if (this.props.user) return <Redirect to={'/dashboard'} />;
    return (
      <React.Fragment>
        <div>Landing Page</div>
      </React.Fragment>
    );
  }
}

export default LandingPage;
