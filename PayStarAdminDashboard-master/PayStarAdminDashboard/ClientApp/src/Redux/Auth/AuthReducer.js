import { LOGIN_USER, LOADING, GET_ERROR } from "../Types";

// isEmpty will return "true" if the passed-in value is null
const isEmpty = require("is-empty");

// Set the initial values of our state
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
  error: null,
  loginFail: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "LOGIN_USER":
      return {
        // ALWAYS SPREAD CURRENT STATE BEFORE CHANGING STATE WITH PAYLOAD
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case "LOGOUT_USER":
      return {
        // ALWAYS SPREAD CURRENT STATE BEFORE CHANGING STATE WITH PAYLOAD
        ...state,
        isAuthenticated: false,
        user: {},
      };
    case "LOADING":
      return {
        // ALWAYS SPREAD CURRENT STATE BEFORE CHANGING STATE WITH PAYLOAD
        ...state,
        loading: action.payload,
      };
    case "GET_ERROR":
      return {
        // ALWAYS SPREAD CURRENT STATE BEFORE CHANGING STATE WITH PAYLOAD
        ...state,
        error: action.payload,
      };
    case "LOGIN_FAIL":
      return{
        ...state,
        loginFail: action.payload,
      }
    default:
      return state;
  }
}
