import React, { Component } from 'react';

class Error404 extends Component {
  render() {
    return (
      <React.Fragment>
        The page you tried to load <b>"{this.props.location.pathname}"</b> can
        not be found.
      </React.Fragment>
    );
  }
}

export default Error404;
