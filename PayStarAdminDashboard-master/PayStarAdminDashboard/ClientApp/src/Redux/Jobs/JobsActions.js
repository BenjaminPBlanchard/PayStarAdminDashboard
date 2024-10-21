import { JOBS_TYPES } from "../Types";
import Axios from "axios";

export const GetJobsAction = (data) => ({
  type: JOBS_TYPES.GET_JOBS,
  payload: data,
});

export const GetJobByIdAction = (data) => ({
  type: JOBS_TYPES.GET_JOB_BY_ID,
  payload: data,
});

export const GetJobsExpectAction = (data) => ({
  type: JOBS_TYPES.GET_JOBS_EXPECT,
  payload: data,
});

export const JobsLoadingAction = (bool) => ({
  type: JOBS_TYPES.JOBS_LOADING,
  payload: bool,
});

export const JobByIdLoadingAction = (bool) => ({
  type: JOBS_TYPES.JOB_LOADING,
  payload: bool,
});

export const JobsErrorAction = (error) => ({
  type: JOBS_TYPES.JOBS_ERROR,
  payload: error,
});

export const JobByIdErrorAction = (error) => ({
  type: JOBS_TYPES.JOB_ERROR,
  payload: error,
});

export const GetJobCountAction = (data) => ({
  type: JOBS_TYPES.GET_JOB_COUNTS,
  payload: data,
});

export const GetJobs = () => (dispatch) => {
  dispatch(JobsLoadingAction(true));
  Axios.get(`/api/jobs`)
    .then((res) => {
      const jobs = res.data;
      dispatch(GetJobsAction(jobs));
    })
    .catch((err) => {
      dispatch(JobsErrorAction(err.message || "Error fetching jobs data..."));
    })
    .finally(() => {
      dispatch(JobsLoadingAction(false));
    });
};

export const GetJobById = (job) => (dispatch) => {
  dispatch(JobByIdLoadingAction(true));
  Axios.get(`/api/jobs/${job.id}`)
    .then((res) => {
      const job = res.data;
      dispatch(GetJobByIdAction(job));
    })
    .catch((err) => {
      dispatch(JobByIdErrorAction(err.message || "Error fetching job data"));
    })
    .finally(() => {
      dispatch(JobByIdLoadingAction(false));
      dispatch(GetJobsExpectations(job));
    });
};

export const GetJobsExpectations = () => (dispatch) => {
  dispatch(JobByIdLoadingAction(true));
  Axios.get(`/api/jobExpectations/`)
    .then((res) => {
      const jobExpect = res.data;
      dispatch(GetJobsExpectAction(jobExpect));
    })
    .catch((err) => {
      dispatch(
        JobByIdErrorAction(
          err.message || "Error fetching job expectations data"
        )
      );
    })
    .finally(() => {
      dispatch(JobByIdLoadingAction(false));
    });
};
export const CreateJobExpectations = (jobExpect) => (dispatch) => {
  Axios.post(`api/jobExpectations`, jobExpect)
    .then((res) => {
      if (res.status === 200) {
        console.log("Created expectation: " + res.data);
      }
    })
    .catch((res) => {
      console.log(res.message);
    })
    .finally(() => {
      dispatch(GetJobsExpectations());
    });
};
export const UpdateJobExpectations = (jobExpect) => (dispatch) => {
  dispatch(JobByIdLoadingAction(true));
  Axios.put(`/api/jobExpectations?id=${jobExpect.id}`, jobExpect)
    .then((res) => {
      if (res.status === 200) {
        console.log("Updated Expectation: " + res.data);
      }
    })
    .catch((err) => {
      dispatch(
        JobByIdErrorAction(
          err.message || "Error updating job expectations data"
        )
      );
    })
    .finally(() => {
      dispatch(JobByIdLoadingAction(false));
      dispatch(GetJobsExpectations(jobExpect.jobId));
    });
};

export const deleteJobExpectation = (jobExpect) => (dispatch) => {
  Axios.delete(`/api/jobExpectations/`, jobExpect.id)
    .then((res) => {
      if (res.status === 200) {
        console.log("Deleted expectation: " + res.data);
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dispatch(GetJobsExpectations(jobExpect.jobId));
    });
};

export const GetJobsCount = () => (dispatch) => {
  dispatch(JobsLoadingAction(true));
  Axios.get(`/api/jobs/getAllSucceded-FailedCount`)
    .then((res) => {
      const jobsCount = res.data;
      dispatch(GetJobCountAction(jobsCount));
    })
    .catch((err) => {
      console.log(err.message);
    })
    .finally(() => {
      dispatch(JobsLoadingAction(false));
    });
};
