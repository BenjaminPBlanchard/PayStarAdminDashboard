import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { CreateClient, GetClients } from "../../Redux/Clients/ClientsActions";
import Loading from "../../Components/Loading/Loading";
import ClientsTable from "../../Components/ClientsTable/ClientsTable";

const Clients = (props) => {
  const [clientArr, setClientArr] = useState([]);
  const [isBusy, setIsBusy] = useState(true);
  useEffect(() => {
    props.GetClients();
    setClientArr(props.clients);
    setIsBusy(false);
  }, []);

  return (
    <div>
      {!isBusy ? (
        <ClientsTable clients={clientArr} PostClient={props.PostClient} />
      ) : (
        <Loading />
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    clients: state.ClientsReducer.clients,
    clientsLoading: state.ClientsReducer.clientsLoading,
    clientsError: state.ClientsReducer.clientsError,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    GetClients: () => {
      dispatch(GetClients());
    },
    PostClient: (client) => {
      dispatch(CreateClient(client));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Clients);
