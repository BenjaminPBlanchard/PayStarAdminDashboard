import { CLIENTS_TYPES } from "../Types";
import { _ClientsURL } from "../../Constants";
import Axios from "axios";

export const GetClientsAction = (data) => ({
  type: CLIENTS_TYPES.GET_CLIENTS,
  payload: data,
});
export const GetClientsByIdAction = (data) => ({
  type: CLIENTS_TYPES.GET_CLIENTS_BY_ID,
  payload: data,
});
export const UpdateClientsAction = (data) => ({
  type: CLIENTS_TYPES.UPDATE_CLIENTS,
  payload: data,
});
export const DeleteClientsAction = (data) => ({
  type: CLIENTS_TYPES.DELETE_CLIENTS,
  payload: data,
});
export const ClientsLoadingAction = (bool) => ({
  type: CLIENTS_TYPES.CLIENTS_LOADING,
  payload: bool,
});
export const ClientsByIdLoadingAction = (bool) => ({
  type: CLIENTS_TYPES.CLIENTS_BY_ID_LOADING,
  payload: bool,
});
export const ClientsErrorAction = (error) => ({
  type: CLIENTS_TYPES.CLIENTS_ERROR,
  payload: error,
});
export const GetClientsByIdErrorAction = (error) => ({
  type: CLIENTS_TYPES.CLIENTS_BY_ID_ERROR,
  payload: error,
});
export const UpdateClientErrorAction = (error) => ({
  type: CLIENTS_TYPES.UPDATE_CLIENT_ERROR,
  payload: error,
});
export const GetClientsStatsAction = (data) => ({
  type: CLIENTS_TYPES.GET_CLIENTS_TRANSACTIONS,
  payload: data,
});

export const GetClients = () => (dispatch) => {
  const url = _ClientsURL;
  dispatch(ClientsLoadingAction(true));
  Axios.get(url)
    .then((res) => {
      const clients = res.data;
      dispatch(GetClientsAction(clients));
    })
    .catch((err) => {
      dispatch(
        ClientsErrorAction(err.message || "Error fetching Client data..")
      );
    })
    .finally(() => {
      dispatch(ClientsLoadingAction(false));
    });
};
export const GetClientById = (clientId) => (dispatch) => {
  const url = _ClientsURL;
  dispatch(ClientsByIdLoadingAction(true));
  Axios.get(`${url}/${clientId}`)
    .then((res) => {
      const client = res.data[0];
      dispatch(GetClientsByIdAction(client));
    })
    .catch((err) => {
      dispatch(
        GetClientsByIdErrorAction(err.message || "Error fetching Client data..")
      );
    })
    .finally(() => dispatch(ClientsByIdLoadingAction(false)));
};
// TODO: Update Client
export const UpdateClient = (data) => (dispatch) => {
  dispatch(ClientsByIdLoadingAction(true));
  console.log("Attempting to update client...");
  console.log(JSON.stringify(data));
  const newClient = {
    ivrPhoneNumber: data.ivrPhoneNumber,
    phoneNumber: data.phoneNumber,
    name: data.name,
    billingSystem: data.billingSystem,
    versionOneId: data.versionOneId,
    versionTwoId: data.versionTwoId,
    isMigrating: data.isMigrating,
    streetAddress: data.streetAddress,
    city: data.city,
    zip: data.zip,
    state: data.state,
    country: data.country,
  };
  Axios.put(`${_ClientsURL}?id=${data.id}`, newClient)
    .then((res) => {
      if (res.status === 200) {
        console.log("Updated Client.");
        dispatch(GetClientsByIdAction(data));
      }
    })
    .catch((error) => {
      UpdateClientErrorAction(error.message || "Error fetching Client data..");
    })
    .finally(() => {
      dispatch(ClientsByIdLoadingAction(false));
      dispatch(GetClients());
    });
};
// TODO: Delete Clients
export const DeleteClients = (client) => (dispatch) => {};

export const CreateClient = (client) => (dispatch) => {
  Axios.post("/api/client", client)
    .then((res) => {
      if (res.status === 200) {
        console.log("Client created: " + res.data);
      }
    })
    .catch((res) => {
      console.log(res);
    })
    .finally(() => {
      dispatch(GetClients());
    });
};
export const GetClientStats = () => (dispatch) => {
  dispatch(ClientsLoadingAction(true));
  Axios.get(`/api/client/transactionInfo`)
    .then((res) => {
      const stats = res.data;
      dispatch(GetClientsStatsAction(stats));
    })
    .catch((err) => console.log(err.message))
    .finally(() => {
      dispatch(ClientsLoadingAction(false));
    });
};
