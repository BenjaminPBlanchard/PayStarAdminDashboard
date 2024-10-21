import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Message } from "semantic-ui-react";
import "./LoginForm.css";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser, logoutUser } from "../../Redux/Auth/AuthActions";
import Loading from "../Loading/Loading";

const LoginForm = (props) => {
  const [userLogin, setUserLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginAlert, setLoginAlert] = useState(false);

  function login() {
    const user = {
      userName: userLogin,
      Password: password,
    };
    setLoginAlert(false);
    props.loginUser(user);
    setLoginAlert(props.auth.loginFail || true);
  }

  return !props.auth.loading ? (
    !props.auth.isAuthenticated ? (
      <div>
        <Form className="Login-Container">
          <FormGroup>
            <Label for="exampleEmail">Username</Label>
            <Input
              onChange={(e) => {
                setUserLogin(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input
              type="password"
              name="password"
              id="examplePassword"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FormGroup>
          <div className="Padding">
            <Button color="primary" block className="Button" onClick={login}>
              Log In
            </Button>
          </div>
        </Form>
        {loginAlert !== false && (
          <div className={"login-alert"}>
            <Message error>
              <Message.Header> Login Error</Message.Header>
              <p>Incorrect username or password.</p>
            </Message>
          </div>
        )}
      </div>
    ) : (
      <Redirect to={"/dashboard"} />
    )
  ) : (
    <Loading />
  );
};

// Map Redux State to props
function mapStateToProps(state) {
  return {
    auth: state.AuthReducer,
  };
}
// Dispatching Functions from the AuthActions file
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (userData) => {
      dispatch(loginUser(userData));
    },
    logoutUser: () => dispatch(logoutUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
