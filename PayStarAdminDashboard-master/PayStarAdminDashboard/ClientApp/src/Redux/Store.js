import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./index";

// Save current state to local storage
function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
    const serializedUserState = JSON.stringify(state.AuthReducer);
    localStorage.setItem("user", serializedUserState);
  } catch (e) {
    console.log(e);
  }
}
// Load state from local storage
function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
const persistedState = loadFromLocalStorage();
const _Store = createStore(rootReducer, persistedState, applyMiddleware(thunk));

_Store.subscribe(() => saveToLocalStorage(_Store.getState()));

export default _Store;
