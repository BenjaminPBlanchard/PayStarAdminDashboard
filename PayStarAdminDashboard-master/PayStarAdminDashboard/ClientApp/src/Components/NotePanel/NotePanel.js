import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { TextArea, Divider } from "semantic-ui-react";
import Card from "@material-ui/core/Card";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import Loading from "../../Components/Loading/Loading";
import { Grid } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import "./NotePanel.css";

export default function NotePanel(props) {
  const [editable, setEditable] = useState(null);
  const [textAreaState, setTextAreaState] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [postData, setPostData] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    props.getNotesByClient(props.clientId);
    return () => {};
  }, []);

  const findUserById = (id) => {
    return props.users.find((user) => user.id === id);
  };
  const editNoteFunction = (index, note) => {
    setTextAreaState(note.content);
    setEditable(index);
  };
  const saveNoteFunction = (note) => {
    if (updateData) {
      note.content = updateData;
      props.editNote(note);
    }
    setEditable(null);
  };
  const cancelEditFunction = () => {
    setEditable(null);
    setUpdateData(null);
  };
  const onEdit = (data) => {
    setUpdateData(data);
  };
  const createNoteFunction = (content) => {
    if (content) {
      const notePost = {
        content: content,
        createdDate: new Date().toJSON(),
        clientId: parseInt(props.clientId),
      };
      props.createNote(notePost);
      setIsCreating(false);
    }
  };
  const deleteNoteFunction = (note) => {
    setEditable(null);
    props.nukeNote(note);
  };

  return (
    <Card className={"note-card"}>
      <div className={"note-row"}>
        <div className="infoTitle">Notes</div>
        <Button
          className={"note-button"}
          onClick={() => {
            setIsCreating(true);
          }}
        >
          <AddIcon />
        </Button>
      </div>
      <Divider />
      {isCreating && (
        <div>
          <div
            style={{
              paddingTop: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
            }}
          >
            <Typography style={{ marginLeft: "10px", fontSize: "18" }}>
              New Note
            </Typography>
            <TextArea
              className={"note-text-area"}
              onChange={(event) => setPostData(event.target.value)}
            />
          </div>
          <div className={"note-align-end"}>
            <Button onClick={() => setIsCreating(false)}>
              <CloseIcon />
            </Button>
            <Button
              onClick={() => {
                createNoteFunction(postData);
              }}
            >
              <CheckIcon />
            </Button>
          </div>
          <Divider />
        </div>
      )}
      <div className={"note-list"}>
        {!props.notesLoading ? (
          <div>
            {props.notes?.length ? (
              props.notes.map((note, index) => (
                <Paper key={index} elevation={2} className={"note-paper"}>
                  <Grid container>
                    <Grid item container direction={"column"} spacing={1}>
                      <Grid item>
                        <div className={"note-row"}>
                          <Typography
                            component={"div"}
                            className={"note-font-style"}
                          >
                            {findUserById(note.userId) != null &&
                              findUserById(note.userId).userName}
                          </Typography>
                          {note.userId === props.currentUser.id && (
                            <div>
                              {editable !== index ? (
                                <Button
                                  onClick={() => {
                                    editNoteFunction(index, note);
                                  }}
                                  id={index}
                                >
                                  <EditIcon />
                                </Button>
                              ) : (
                                <div className={"note-row"}>
                                  <Button
                                    onClick={() => {
                                      cancelEditFunction();
                                    }}
                                    id={index}
                                  >
                                    <CloseIcon />
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      saveNoteFunction(note);
                                    }}
                                    id={index}
                                  >
                                    <CheckIcon />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {editable === index ? (
                          <TextArea
                            className={"note-text-area"}
                            defaultValue={textAreaState}
                            onChange={(event) => onEdit(event.target.value)}
                          />
                        ) : (
                          <Typography
                            gutterBottom
                            component={"div"}
                            className={"note-Body"}
                          >
                            {note.content}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item>
                        <div className={"note-row"}>
                          <Typography
                            color={"textSecondary"}
                            className={"note-Body"}
                          >
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                              hour: "numeric",
                              minute: "2-digit",
                              second: "2-digit",
                            }).format(new Date(note.createdDate))}
                          </Typography>
                          {editable === index && (
                            <Button
                              onClick={() => {
                                deleteNoteFunction(note);
                              }}
                              id={index}
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              ))
            ) : (
              <Typography className={"notes-empty "}>
                No notes to display for client.
              </Typography>
            )}
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </Card>
  );
}
