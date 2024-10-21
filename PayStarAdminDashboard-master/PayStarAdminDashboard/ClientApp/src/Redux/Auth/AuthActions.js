import Axios from "axios";
import { LOGIN_USER, LOADING, GET_ERROR, LOGOUT_USER } from "../Types";
import { authURL } from "../../Constants";

// TYPE ACTIONS
/**
 * Actions get sent to the switch statement in the reducer.
 * Actions carry the TYPE and a PAYLOAD (data being sent to reducer)
 */
export const loginUserAction = (user) => ({
  type: "LOGIN_USER",
  payload: user,
});
export const loadingAction = (bool) => ({
  type: "LOADING",
  payload: bool,
});
export const getErrorAction = (error) => ({
  type: "GET_ERROR",
  payload: error,
});
export const logoutUserAction = (user) => ({
  type: "LOGOUT_USER",
  payload: user,
});
export const loginFailAction = (bool) => ({
  type: "LOGIN_FAIL",
  payload: bool,
});
// Login Function
export const loginUser = (userData) => (dispatch) => {
  const url = authURL + "/login";

  // set loading to true while we hit the api
  dispatch(loadingAction(true));

  Axios.post(url, userData)
    .then((res) => {
      //save user data to 'user'
      const user = res.data;
      dispatch(loginUserAction(user));
      // A lil bit of debugging
      console.log("Status Code: " + res.status);
      console.log("Found User: " + JSON.stringify(res.data));
    })
    .catch((err) => {
      dispatch(getErrorAction(err.message || "Error Logging in"));
      dispatch(loginFailAction(true));
    })
    .finally(() => {
      dispatch(loadingAction(false));
    });
};

// Logout
export const logoutUser = (user) => (dispatch) => {
  const url = authURL + "/logout";
  // set loading to true while we hit the api
  dispatch(loadingAction(true));
  Axios.post(url)
    .then((res) => {
      console.log("Logging out...", res.status);
      if (res.status === 200) {
        dispatch(logoutUserAction(user));
      }
    })
    .catch((err) => {
      dispatch(getErrorAction(err.message || "Error Logging Out"));
    });
  dispatch(loadingAction(false));
};
