import React from 'react';

import { Redirect, Route } from 'react-router-dom';

// HOC(Higher Order Component) For Public Routes
const PublicRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === false ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PublicRoute;
