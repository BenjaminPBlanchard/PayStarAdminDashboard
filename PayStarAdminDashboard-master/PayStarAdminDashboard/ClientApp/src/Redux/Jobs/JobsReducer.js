import { JOBS_TYPES } from "../Types";
const initialState = {
  jobs: [],
  jobById: {},
  jobsExpect: [],
  jobsError: null,
  jobsLoading: false,
  jobsCount: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case JOBS_TYPES.GET_JOBS:
      return {
        ...state,
        jobs: action.payload,
      };
    case JOBS_TYPES.GET_JOB_BY_ID:
      return {
        ...state,
        jobById: action.payload,
      };
    case JOBS_TYPES.GET_JOBS_EXPECT:
      return {
        ...state,
        jobsExpect: action.payload,
      };
    case JOBS_TYPES.JOBS_LOADING:
      return {
        ...state,
        jobsLoading: action.payload,
      };
    case JOBS_TYPES.JOBS_ERROR:
      return {
        ...state,
        jobsError: action.payload,
      };
    case JOBS_TYPES.GET_JOB_COUNTS:
      return {
        ...state,
        jobsCount: action.payload,
      };
    default:
      return state;
  }
}
