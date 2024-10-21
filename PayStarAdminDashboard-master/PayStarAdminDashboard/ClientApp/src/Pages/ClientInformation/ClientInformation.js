import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import AddressCard from "../../Components/AddressCard/AddressCard";
import ContactsTable from "../../Components/ContactsTable/ContactsTable";
import "./ClientInformation.css";
import { connect } from "react-redux";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotesByClient,
  updateNote,
} from "../../Redux/Notes/NotesActions";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Paper from "@material-ui/core/Paper";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import {
  GetClientById,
  UpdateClient,
} from "../../Redux/Clients/ClientsActions";
import { getAllUsers, getUserById } from "../../Redux/Users/UsersActions";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

import {
  Loader,
  TextArea,
  Form,
  Statistic,
  Button as SemButton,
} from "semantic-ui-react";
import { makeStyles } from "@material-ui/core/styles";
import { Badge } from "@material-ui/core";
import { Redo } from "@material-ui/icons";
import NotePanel from "../../Components/NotePanel/NotePanel";

const ClientInformation = (props) => {
  const clientId = props.match.params.id;
  const users = props.allUsers;

  console.log(users);
  useEffect(() => {
    props.getClientById(clientId);
    props.getAllUsers();
    return () => {};
  }, []);
  const { updateClient, client, createNote } = props;
  return (
    <div className={"mainContainer"}>
      <div>
        {props.clientByIdLoading ? (
          <Loader inline={"centered"} className={"loader"} active />
        ) : (
          <div>
            <div className={"infoTitle"}>Client Information</div>
            <div className={"topContainer"}>
              <InfoCard
                updateClient={updateClient}
                client={client}
                loading={props.clientByIdLoading}
                getClient={props.getClientById}
              />
              <div>
                <StatsCard client={client} />
                <AddressCard
                  client={client}
                  Title={"Address"}
                  updateClient={updateClient}
                />
              </div>
            </div>
            <ContactsTable ClientId={props.match.params.id} />
            <Paper>
              <NotePanel
                clientId={clientId}
                notes={props.notes}
                notesLoading={props.notesLoading}
                users={users}
                getNotesByClient={props.getNotesByClient}
                nukeNote={props.deleteNote}
                editNote={props.updateNote}
                createNote={createNote}
                currentUser={props.currUser}
              />
            </Paper>
          </div>
        )}
      </div>
    </div>
  );
};
function StatsCard(props) {
  return (
    <Card className={"cardMain"}>
      <CardContent className={"statsCardCont"}>
        <Statistic style={{ flexBasis: "45%" }}>
          <Statistic.Label style={{ color: "#144a6f" }}>
            Transactions
          </Statistic.Label>
          {props.client.transactionCount != null ? (
            <Statistic.Value>
              {props.client.transactionCount.toLocaleString()}
            </Statistic.Value>
          ) : (
            <Typography>No transactions found</Typography>
          )}
        </Statistic>
        <Statistic style={{ marginLeft: "0px" }}>
          <Statistic.Label style={{ color: "#144a6f" }}>
            Net Revenue
          </Statistic.Label>
          {props.client.netRevenue != null ? (
            <Statistic.Value>
              ${props.client.netRevenue.toLocaleString()}
            </Statistic.Value>
          ) : (
            <Typography> Net revenue not found</Typography>
          )}
        </Statistic>
      </CardContent>
    </Card>
  );
}
// Basic Info card
function InfoCard(props) {
  let { client } = props;
  const [mapValues, setMapValues] = useState(client);
  const [readOnly, setReadOnly] = useState(true);
  const [updateData, setUpdateData] = useState(client);
  const [tempData, setTempData] = useState(client);
  const [orderedClient, setOrderedClient] = useState({
    name: props.client.name,
    billingSystem: props.client.billingSystem,
    phoneNumber: props.client.phoneNumber,
    ivrPhoneNumber: props.client.ivrPhoneNumber,
    versionOneId: props.client.versionOneId,
    versionTwoId: props.client.versionTwoId,
  });
  const onChange = (data, field) => {
    const value = data;
    switch (field) {
      case "ivrPhoneNumber":
        return setUpdateData((prevState) => {
          let returnData = { ...prevState };
          returnData.ivrPhoneNumber = value;
          return returnData;
        });
      case "phoneNumber":
        return setUpdateData((prevState) => {
          let returnData = { ...prevState };
          returnData.phoneNumber = value;
          return returnData;
        });
      case "billingSystem":
        return setUpdateData((prevState) => {
          let returnData = { ...prevState };
          returnData.billingSystem = value;
          return returnData;
        });
      case "city":
        return setUpdateData((prevState) => {
          let returnData = { ...prevState };
          returnData.city = value;
          return returnData;
        });
      case "name":
        return setUpdateData((prevState) => {
          let returnData = { ...prevState };
          returnData.name = value;
          return returnData;
        });
      case "isMigrating":
        console.log("migrate change" + data);
        return setUpdateData((prevState) => {
          let returnData = { ...prevState };
          returnData.isMigrating = value;
          return returnData;
        });
      case "streetAddress":
        return setUpdateData((prevState) => {
          let returnData = { ...prevState };
          returnData.streetAddress = value;
          return returnData;
        });
      case "versionOneId":
        return setUpdateData((prevState) => {
          let returnData = { ...prevState };
          returnData.versionOneId = value;
          return returnData;
        });
      case "versionTwoId":
        return setUpdateData((prevState) => {
          let returnData = { ...prevState };
          returnData.versionTwoId = value;
          return returnData;
        });
      case "zip":
        return setUpdateData((prevState) => {
          let returnData = { ...prevState };
          returnData.zip = value;
          return returnData;
        });
    }
  };
  const saveChanges = (newClient) => {
    props.updateClient(newClient);
    console.log("edited client... " + newClient);
  };
  const handlePaymentClick = () => {
    if (client.versionTwoId != null && client.versionTwoId.length !== 0) {
      window.open(
        `https://secure.paystar.io/app/customer/${client.versionTwoId}`
      );
    } else if (
      client.versionOneId != null &&
      client.versionOneId.length !== 0
    ) {
      window.open(
        ` https://www.paystar.co/MakePayment/SubInput/${client.versionOneId}`
      );
    } else {
      alert("No version id set.");
    }
  };
  return (
    <Card style={{ flexBasis: "100%" }}>
      <CardContent className={"placement"}>
        {!props.loading ? (
          Object.entries(orderedClient).map(([key, val]) =>
            !unwanted(key) ? (
              <TextField
                className="padding"
                key={key}
                id={key}
                label={setLabel(key)}
                defaultValue={val}
                InputProps={{
                  readOnly: readOnly,
                }}
                onChange={(event) =>
                  onChange(event.target.value, event.target.id)
                }
              />
            ) : null
          )
        ) : (
          <Loader inline={"centered"} className={"loader"} active />
        )}
      </CardContent>
      <CardActions>
        {!readOnly ? (
          <div className={"cardFootForm"}>
            <div>
              <Button
                onClick={() => {
                  setReadOnly(true);
                  saveChanges(updateData);
                }}
              >
                <CheckIcon />
              </Button>
              <Button
                onClick={() => {
                  setReadOnly(true);
                  props.getClient(client.id);
                }}
              >
                <CloseIcon />
              </Button>
            </div>
            <SemButton
              toggle
              active={updateData.isMigrating}
              onClick={() => onChange(!updateData.isMigrating, "isMigrating")}
            >
              is Migrating
            </SemButton>
            <SemButton content={"Collect Payment"} primary disabled />
          </div>
        ) : (
          <div className={"cardFootForm"}>
            <Button onClick={() => setReadOnly(false)}>
              <EditIcon />
            </Button>
            {updateData.isMigrating && (
              <div style={{ marginTop: "8px" }}>
                <Badge style={{ color: "#144a6f" }}>
                  <Redo />
                </Badge>
                <Badge>
                  <Typography>is Migrating</Typography>
                </Badge>
              </div>
            )}
            <SemButton
              content={"Collect Payment"}
              primary
              onClick={() => handlePaymentClick()}
            />
          </div>
        )}
      </CardActions>
    </Card>
  );
}
// Function to change object keys to easily readable strings
function setLabel(label) {
  switch (label) {
    case "id":
      return "Id";
    case "ivrPhoneNumber":
      return "IVR Phone Number";
    case "phoneNumber":
      return "Phone Number";
    case "billingSystem":
      return "Billing System";
    case "city":
      return "City";
    case "name":
      return "Client Name";
    case "isMigrating":
      return "Migrating";
    case "streetAddress":
      return "Street Address";
    case "versionOneId":
      return "Version Id";
    case "versionTwoId":
      return "Version Two Slug";
    case "zip":
      return "Zip Code";
  }
}
function unwanted(key) {
  if (key === "hubSpotId" || key === "streetAddress") {
    return true;
  }
}

const mapStateToProps = (state) => {
  return {
    notes: state.NotesReducer.notes,
    noteById: state.NotesReducer.noteById,
    notesError: state.NotesReducer.notesError,
    notesLoaded: state.NotesReducer.notesLoading,
    client: state.ClientsReducer.clientById,
    clients: state.ClientsReducer.clients,
    clientByIdLoading: state.ClientsReducer.clientByIdLoading,
    noteCreator: state.UsersReducer.userById,
    allUsers: state.UsersReducer.allUsers,
    currUser: state.AuthReducer.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    createNote: (note) => {
      dispatch(createNote(note));
    },
    getNotesByClient: (clientId) => {
      dispatch(getNotesByClient(clientId));
    },
    getNoteById: (noteId) => {
      dispatch(getNoteById(noteId));
    },
    updateNote: (note) => {
      dispatch(updateNote(note));
    },
    deleteNote: (note) => {
      dispatch(deleteNote(note));
    },
    getClientById: (clientId) => {
      dispatch(GetClientById(clientId));
    },
    updateClient: (newClient) => {
      dispatch(UpdateClient(newClient));
    },
    getAllUsers: () => {
      dispatch(getAllUsers());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ClientInformation);
