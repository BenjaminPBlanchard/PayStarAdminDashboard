import { HUBSPOT_TYPES } from "../Types";

const initialState = {
  engagementsResults: [],
  engagementsLoading: false,
  contactsResults: [],
  contactsLoading: false,
  error: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case HUBSPOT_TYPES.GET_ENGAGEMENTS:
      return {
        // ALWAYS SPREAD CURRENT STATE BEFORE CHANGING STATE WITH PAYLOAD
        ...state,
        engagementsResults: action.payload,
      };
    case HUBSPOT_TYPES.ENGAGEMENTS_LOADING:
      return {
        // ALWAYS SPREAD CURRENT STATE BEFORE CHANGING STATE WITH PAYLOAD
        ...state,
        engagementsLoading: action.payload,
      };
    case HUBSPOT_TYPES.GET_CONTACTS:
      return {
        // ALWAYS SPREAD CURRENT STATE BEFORE CHANGING STATE WITH PAYLOAD
        ...state,
        contactsResults: action.payload,
      };
    case HUBSPOT_TYPES.CONTACTS_LOADING:
      return {
        // ALWAYS SPREAD CURRENT STATE BEFORE CHANGING STATE WITH PAYLOAD
        ...state,
        contactsLoading: action.payload,
      };
    case HUBSPOT_TYPES.HSPOT_ERROR:
      return {
        // ALWAYS SPREAD CURRENT STATE BEFORE CHANGING STATE WITH PAYLOAD
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
