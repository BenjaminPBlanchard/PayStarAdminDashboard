import { USERS_TYPES } from "../Types";

const initialState = {
  usersLoading: false,
  usersError: false,
  userById: {},
  allUsers: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USERS_TYPES.GET_USER_BY_ID:
      return {
        ...state,
        userById: action.payload
      };
    case USERS_TYPES.USERS_LOADING:
      return {
        ...state,
        usersLoading: action.payload
      };
    case USERS_TYPES.USERS_ERROR:
      return {
        ...state,
        usersError: action.payload
      };
    case USERS_TYPES.GET_ALL_USERS:
      return{
        ...state,
        allUsers: action.payload
      };
    default:
      return state;
  }
}
