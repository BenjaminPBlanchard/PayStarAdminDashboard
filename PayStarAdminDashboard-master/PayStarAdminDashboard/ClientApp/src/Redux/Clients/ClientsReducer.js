import { CLIENTS_TYPES } from "../Types";

const initialState = {
  clients: [],
  clientById: {
    Id: "",
    IvrPhoneNumber: "",
    PhoneNumber: "",
    Name: "",
    BillingSystem: "",
    City: "",
    isMigrating: "",
    StreetAddress: "",
    State: "",
    Zip: "",
    Country: "",
    VersionOneId: "",
    VersionTwoId: "",
    transactionCount: 0,
    netRevenue: 0,
  },
  clientsLoading: false,
  clientByIdLoading: false,
  clientsError: null,
  clientByIdError: null,
  updateClientError: null,
  clientsStats: {},
};

// TODO: Fill out each case with relevant state changes
export default function (state = initialState, action) {
  switch (action.type) {
    case CLIENTS_TYPES.GET_CLIENTS:
      return {
        ...state,
        clients: action.payload,
      };
    case CLIENTS_TYPES.GET_CLIENTS_BY_ID:
      return {
        ...state,
        clientById: action.payload,
      };
    case CLIENTS_TYPES.UPDATE_CLIENTS:
      return {
        ...state,
      };
    case CLIENTS_TYPES.DELETE_CLIENTS:
      return {
        ...state,
      };
    case CLIENTS_TYPES.CLIENTS_ERROR:
      return {
        ...state,
        clientsError: action.payload,
      };
    case CLIENTS_TYPES.CLIENTS_BY_ID_ERROR:
      return {
        ...state,
        clientByIdError: action.payload,
      };
    case CLIENTS_TYPES.CLIENTS_LOADING:
      return {
        ...state,
        clientsLoading: action.payload,
      };
    case CLIENTS_TYPES.CLIENTS_BY_ID_LOADING:
      return {
        ...state,
        clientByIdLoading: action.payload,
      };
    case CLIENTS_TYPES.UPDATE_CLIENT_ERROR:
      return {
        ...state,
        updateClientError: action.payload,
      };
    case CLIENTS_TYPES.GET_CLIENTS_TRANSACTIONS:
      return {
        ...state,
        clientsStats: action.payload,
      };
    default:
      return state;
  }
}
