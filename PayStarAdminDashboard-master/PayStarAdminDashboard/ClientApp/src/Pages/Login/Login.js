import React from "react";
import "../../Components/LoginForm/LoginForm.js";
import LoginForm from "../../Components/LoginForm/LoginForm.js";
import { connect } from "react-redux";

const Login = () => {
  return (
    <div style={{ paddingTop:100}}>
      <LoginForm />
    </div>
  );
};

// Map Redux State to props
function mapStateToProps(state) {
  return {
    auth: state.AuthReducer,
  };
}

export default connect(mapStateToProps)(Login);
