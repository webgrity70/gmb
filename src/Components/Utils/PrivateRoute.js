import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      rest.user !== false ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect to={`/login/?redirect=${props.location.pathname}`} />
      )
    }
  />
);

export default PrivateRoute;
