import React, { useState, useEffect } from "react";
import axios from "axios";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import "./SalesAgencyInformation.css";

const SalesAgencyInformation = props => {
  const [SAObj, setSAObj] = useState("");
  const [isBusy, setIsBusy] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const updateIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const updateValue = async () => {
    await axios
      .put("/api/sales-agency/" + props.match.params.id, { Name: SAObj })
      .then(req => console.log(req))
      .finally()
      .catch(error => console.log("Error: " + error));
    updateIsEditing();
  };

  const updateSAValue = e => {
    setSAObj(e.currentTarget.value);
    console.log(e.currentTarget.value);
  };

  useEffect(() => {
    axios
      .get("/api/sales-agency/" + props.match.params.id)
      .then(request => setSAObj(request.data[0].name))
      .finally(() => {
        setIsBusy(false);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <div className={"mainContainer"}>
      <div className={"Header"}>
        {isEditing ? (
          <div className={"SAInfo"}>
            <TextField
              className={"SAEditField"}
              label={"Name"}
              defaultValue={SAObj}
              onBlur={e => {
                updateSAValue(e);
              }}
            />
            <Button className={"SAEditConfirmButton"} onClick={updateValue}>
              <CheckIcon />
            </Button>
          </div>
        ) : (
          <div className={"SAInfo"}>
            <h1 className={"SAName"}>{SAObj}</h1>
            <Button className={"SAEditButton"} onClick={updateIsEditing}>
              <EditIcon />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesAgencyInformation;
