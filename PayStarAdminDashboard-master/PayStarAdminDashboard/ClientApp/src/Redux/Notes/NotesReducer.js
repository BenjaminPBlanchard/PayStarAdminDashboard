import { NOTES_TYPES } from "../Types";

const initialState = {
  notes: [],
  notesLoading: false,
  notesUpdating: false,
  notesError: null,
  noteById: {},
  recentNotes:[],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case NOTES_TYPES.GET_NOTE_BY_ID:
      return {
        ...state,
        noteById: action.payload,
      };
    case NOTES_TYPES.GET_NOTES_BY_CLIENT:
      return {
        ...state,
        notes: action.payload,
      };
    case NOTES_TYPES.UPDATE_NOTES:
      return {
        ...state,
      };
    case NOTES_TYPES.NOTES_LOADING:
      return {
        ...state,
        notesLoading: action.payload,
      };
    case NOTES_TYPES.NOTES_ERROR:
      return {
        ...state,
        notesError: action.payload,
      };
    case NOTES_TYPES.GET_RECENT_NOTES:
      return {
        ...state,
        recentNotes: action.payload,
      }
    default:
      return state;
  }
}
