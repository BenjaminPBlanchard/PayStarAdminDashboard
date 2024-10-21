import React, { useState } from "react";
import { Search, Label } from "semantic-ui-react";
import "./GlobalSearchBar.css";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import matchSorter from "match-sorter";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotesByClient,
  updateNote,
} from "../../Redux/Notes/NotesActions";
import {
  GetClientById,
  UpdateClient,
} from "../../Redux/Clients/ClientsActions";
import { getAllUsers, getUserById } from "../../Redux/Users/UsersActions";

const GlobalSearchBar = (props) => {
  const clientObj = props.clients;
  const history = useHistory();

  const ClientMapping = (queryArray) => {
    const retArr = [];
    queryArray.map((client) => {
      const retClient = {
        title: "",
      };
      retClient.title = client.name;
      retArr.push(retClient);
    });
    return retArr;
  };
  const [results, setResults] = useState(ClientMapping(clientObj));
  const [query, setQuery] = useState("");

  const findClientByName = (clientName) => {
    return clientObj.find((n) => n.name === clientName);
  };

  function handleSearchChange(event) {
    setQuery(event.target.value);
    setResults(
      ClientMapping(
        matchSorter(clientObj, event.target.value, {
          keys: [
            "name",
            /*"billingSystem",
            "zip",
            "city",
            "streetAddress",
            "phoneNumber",
            "ivrPhoneNumber",*/
          ],
        })
      )
    );
  }

  return (
    <div className={"search-ctr"}>
      <Search
        onResultSelect={(e, data) => {
          const clientRes = findClientByName(data.result.title).id;
          history.push("/Clients/" + clientRes);
          console.log("/Clients/" + findClientByName(data.result.title).id);
          props.getClientById(clientRes);
          setQuery("");
        }}
        onSearchChange={handleSearchChange}
        results={results}
        value={query}
      />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    clients: state.ClientsReducer.clients,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    getClientById: (clientId) => {
      dispatch(GetClientById(clientId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalSearchBar);
