import Axios from "axios";
import { HUBSPOT_TYPES } from "../Types";
import { _HSpotURLs } from "../../Constants";

//Hubspot Actions
export const getEngagementsAction = (data) => ({
  type: HUBSPOT_TYPES.GET_ENGAGEMENTS,
  payload: data,
});

export const getContactsAction = (data) => ({
  type: HUBSPOT_TYPES.GET_CONTACTS,
  payload: data,
});

export const getHSpotErrorAction = (error) => ({
  type: HUBSPOT_TYPES.HSPOT_ERROR,
  payload: error,
});

export const EngagementsLoadingAction = (bool) => ({
  type: HUBSPOT_TYPES.ENGAGEMENTS_LOADING,
  payload: bool,
});

export const ContactsLoadingAction = (bool) => ({
  type: HUBSPOT_TYPES.CONTACTS_LOADING,
  payload: bool,
});

//Hubspot Functions
export const getEngagements = () => (dispatch) => {
  const url = _HSpotURLs.Engagements;

  //set loading to true while we hit the api
  dispatch(EngagementsLoadingAction(true));

  Axios.get(url)
    .then((res) => {
      const engagements = res.data.results;
      dispatch(getEngagementsAction(engagements));
    })
    .catch((err) => {
      dispatch(
        getHSpotErrorAction(err.message || "Error getting engagements.")
      );
    })
    .finally(() => {
      dispatch(EngagementsLoadingAction(false));
    });
};

export const getContacts = () => (dispatch) => {
  const url = _HSpotURLs.Contacts;

  //set loading to true while we hit the api
  dispatch(ContactsLoadingAction(true));
  Axios.get(url)
    .then((res) => {
      const contacts = res.data.contacts;
      dispatch(getContactsAction(contacts));
    })
    .catch((err) => {
      dispatch(getHSpotErrorAction(err.message || "Error getting contacts."));
    })
    .finally(() => {
      dispatch(ContactsLoadingAction(false));
    });
};
