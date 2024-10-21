import Axios from "axios";
import { USERS_TYPES } from "../Types";

// Actions

export const getUserByIdAction = (data) => ({
  type: USERS_TYPES.GET_USER_BY_ID,
  payload: data,
});

export const getAllUsersAction = (data) => ({
  type: USERS_TYPES.GET_ALL_USERS,
  payload: data,
});

export const usersLoadingAction = (bool) => ({
  type: USERS_TYPES.USERS_LOADING,
  payload: bool,
});

export const usersErrorAction = (error) => ({
  type: USERS_TYPES.USERS_ERROR,
  payload: error,
});

export const getUserById = (UserId) => (dispatch) => {
  dispatch(usersLoadingAction(true));

  Axios.get(`api/user/${UserId}`)
    .then((res) => {
      const users = res.data;
      console.log("users found: " + users);
      dispatch(getUserByIdAction(users));
    })
    .catch((error) => {
      dispatch(usersErrorAction(error.message || "Error retrieving user."));
    })
    .finally(() => dispatch(usersLoadingAction(false)));
};

export const getAllUsers = () => (dispatch) => {
  dispatch(usersLoadingAction(true));

  Axios.get(`${window.location.origin.toString()}/api/user`)
    .then((res) => {
      const users = res.data;
      console.log("Users found: " + users);
      dispatch(getAllUsersAction(users));
    })
    .catch((error) => {
      dispatch(usersErrorAction(error.message || "Error retrieving users."));
    })
    .finally(() => dispatch(usersLoadingAction(false)));
};
