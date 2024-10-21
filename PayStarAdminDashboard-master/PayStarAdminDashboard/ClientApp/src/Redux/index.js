import { combineReducers } from "redux";
import AuthReducer from "./Auth/AuthReducer";
import HubspotReducer from "./Hubspot/HubspotReducer";
import ClientsReducer from "./Clients/ClientsReducer";
import NotesReducer from "./Notes/NotesReducer";
import UsersReducer from "./Users/UsersReducer";
import JobsReducer from "./Jobs/JobsReducer";

export default combineReducers({
  AuthReducer,
  HubspotReducer,
  ClientsReducer,
  NotesReducer,
  UsersReducer,
  JobsReducer,
});
