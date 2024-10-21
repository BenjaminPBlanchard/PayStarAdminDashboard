import Axios from "axios";
import { NOTES_TYPES } from "../Types";
import { _NotesURL } from "../../Constants";

// Actions
export const getNotesByClientAction = (data) => ({
  type: NOTES_TYPES.GET_NOTES_BY_CLIENT,
  payload: data,
});
export const getNoteByIdAction = (data) => ({
  type: NOTES_TYPES.GET_NOTE_BY_ID,
  payload: data,
});
export const createNoteAction = (data) => ({
  type: NOTES_TYPES.CREATE_NOTES,
  payload: data,
});
export const updateNoteAction = (data) => ({
  type: NOTES_TYPES.UPDATE_NOTES,
  payload: data,
});
export const deleteNoteAction = (data) => ({
  type: NOTES_TYPES.DELETE_NOTES,
  payload: data,
});
export const notesLoadingAction = (bool) => ({
  type: NOTES_TYPES.NOTES_LOADING,
  payload: bool,
});
export const notesUpdatingAction = (bool) => ({
  type: NOTES_TYPES.NOTES_UPDATING,
  payload: bool,
});
export const notesErrorAction = (error) => ({
  type: NOTES_TYPES.NOTES_ERROR,
  payload: error,
});
export const getRecentNotesAction =(data) =>({
  type: NOTES_TYPES.GET_RECENT_NOTES,
  payload: data,
})
export const getNotesByClient = (ClientId) => (dispatch) => {
  dispatch(notesLoadingAction(true));

  Axios.get(`/api/note/client-id/${ClientId}`)
    .then((res) => {
      const notes = res.data;
      console.log("notes found: " + notes);
      dispatch(getNotesByClientAction(notes));
    })
    .catch((error) => {
      dispatch(notesErrorAction(error.message || "Error retrieving note."));
    })
    .finally(() => dispatch(notesLoadingAction(false)));
};
export const getNoteById = (noteId) => (dispatch) => {
  dispatch(notesLoadingAction(true));

  Axios.get(`/api/note/1?noteId=${noteId}`)
    .then((res) => {
      const note = res.data;
      console.log("note found: " + JSON.stringify(res.data));
      dispatch(getNoteByIdAction(note));
    })
    .catch((error) => {
      dispatch(notesErrorAction(error.message || "Error retrieving note."));
    })
    .finally(() => dispatch(notesLoadingAction(false)));
};
export const updateNote = (note) => (dispatch) => {
  dispatch(notesUpdatingAction(true));

  Axios.put(`/api/note?noteId=${note.id}`, note)
    .then((res) => {
      if (res.status === 200) {
        console.log("updated note: " + JSON.stringify(res.data));
      }
    })
    .catch((error) => {
      dispatch(notesErrorAction(error.message || "Error updating note."));
    })
    .finally(() => {
      dispatch(notesUpdatingAction(false));
      dispatch(getNotesByClient(note.clientId));
    });
};
export const deleteNote = (note) => (dispatch) => {
  Axios.delete(`/api/note?noteId=${note.id}`)
    .then((res) => {
      if (res.status === 200) {
        console.log("deleted note: " + JSON.stringify(res.data));
      }
    })
    .catch((error) => {
      dispatch(notesErrorAction(error.message || "Error deleting note."));
    })
    .finally(() => {
      dispatch(getNotesByClient(note.clientId));
    });
};
export const createNote = (note) => (dispatch) => {
  Axios.post("/api/note", note)
    .then((res) => {
      if (res.status === 200) {
        console.log("created note: " + res.data);
      }
    })
    .catch((res) => {
      console.log(res.message);
    })
    .finally(() => {
      dispatch(getNotesByClient(note.clientId));
    });
};
export const getRecentNotes = () => (dispatch) => {
  dispatch(notesLoadingAction(true));
  Axios.get(`/api/note/getRecentNotes`)
      .then((res) => {
        const recents = res.data;
        dispatch(getRecentNotesAction(recents));
      })
      .catch((error) => {
        dispatch(notesErrorAction(error.message || "Error retrieving  recent notes."));
      })
      .finally(() => dispatch(notesLoadingAction(false)));
};
