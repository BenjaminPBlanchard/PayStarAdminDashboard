import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({
  isAuthenticated,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    component={(props) =>
      isAuthenticated ? <Component {...props} /> : <Redirect to={"/"} />
    }
  />
);

const mapStateToProps = (state) => ({
  isAuthenticated: state.AuthReducer.isAuthenticated,
});

export default connect(mapStateToProps)(PrivateRoute);
