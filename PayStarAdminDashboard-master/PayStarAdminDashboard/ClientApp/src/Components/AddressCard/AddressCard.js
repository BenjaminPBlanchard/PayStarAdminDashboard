import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./AddressCard.css";
import { IconButton, TextField } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { Modal, Button as SemButton } from "semantic-ui-react";

//Takes in Address json as props

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    flexBasis: "50%",
    marginLeft: "10px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 20,
    color: "#144a6f",
  },
  pos: {
    marginBottom: 12,
  },
});

export default function AddressCard(props) {
  const classes = useStyles();
  const client = props.client;
  const [clientEdit, setClientEdit] = useState(props.client);
  const [editModOpen, setEditModOpen] = useState(false);
  const onSubmit = (putClient) => {
    setEditModOpen(false);
    props.client.city = putClient.city;
    props.client.streetAddress = putClient.streetAddress;
    props.client.zip = putClient.zip;
    props.client.state = putClient.state;
    props.client.country = putClient.country;
    props.updateClient(putClient);
  };
  const formatClientState = (event, field) => {
    const value = event.target.value;

    switch (field) {
      case "city":
        return setClientEdit((prevState) => {
          let returnData = { ...prevState };
          returnData.city = value;
          return returnData;
        });
      case "streetAddress":
        return setClientEdit((prevState) => {
          let returnData = { ...prevState };
          returnData.streetAddress = value;
          return returnData;
        });
      case "zip":
        return setClientEdit((prevState) => {
          let returnData = { ...prevState };
          returnData.zip = value;
          return returnData;
        });
      case "state":
        return setClientEdit((prevState) => {
          let returnData = { ...prevState };
          returnData.state = value;
          return returnData;
        });
      case "country":
        return setClientEdit((prevState) => {
          let returnData = { ...prevState };
          returnData.country = value;
          return returnData;
        });
    }
  };
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} gutterBottom>
          {props.Title}
        </Typography>

        <Typography variant="body2" component="div" className={"subContain"}>
          <div className={"AddressInfo"}>
            <Typography>Street: {client.streetAddress}</Typography>
            <Typography>City: {client.city}</Typography>
            <Typography>State: {client.state}</Typography>
            <Typography>Country: {client.country}</Typography>
            <Typography>Zip Code: {client.zip}</Typography>
          </div>
          <Modal
            onClose={() => setEditModOpen(false)}
            onOpen={() => setEditModOpen(true)}
            open={editModOpen}
            className={"Semantic-ModalAddress"}
            trigger={
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setEditModOpen(true)}
                style={{ height: 27 }}
                className={"addEditButton"}
              >
                <EditIcon />
              </IconButton>
            }
          >
            <Modal.Header>Edit Address</Modal.Header>
            <Modal.Content className={"placementModalAdd"}>
              <TextField
                className={"paddingTextFieldAdd"}
                label={"Street Address"}
                defaultValue={client.streetAddress}
                style={{ width: 300 }}
                onChange={(e) => formatClientState(e, "streetAddress")}
              />
              <TextField
                className={"paddingTextFieldAdd"}
                label={"City"}
                defaultValue={client.city}
                style={{ width: 200 }}
                onChange={(e) => formatClientState(e, "city")}
              />
              <TextField
                className={"paddingTextFieldAdd"}
                label={"State"}
                defaultValue={client.state}
                style={{ width: 200 }}
                onChange={(e) => formatClientState(e, "state")}
              />
              <TextField
                className={"paddingTextFieldAdd"}
                label={"Country"}
                defaultValue={client.country}
                style={{ width: 200 }}
                onChange={(e) => formatClientState(e, "country")}
              />
              <TextField
                className={"paddingTextFieldAdd"}
                label={"Zip Code"}
                defaultValue={client.zip}
                style={{ width: 200 }}
                onChange={(e) => formatClientState(e, "zip")}
              />
            </Modal.Content>
            <Modal.Actions>
              <SemButton color="red" onClick={() => setEditModOpen(false)}>
                Cancel
              </SemButton>
              <SemButton color="green" onClick={() => onSubmit(clientEdit)}>
                Set Address
              </SemButton>
            </Modal.Actions>
          </Modal>
        </Typography>
      </CardContent>
    </Card>
  );
}
