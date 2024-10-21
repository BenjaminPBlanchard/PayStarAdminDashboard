import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  useTheme,
  TableFooter,
  TablePagination,
  TextField,
  Toolbar,
} from "@material-ui/core";
import { Input, Button, Icon, Modal } from "semantic-ui-react";
import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardArrowUp,
} from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import { connect } from "react-redux";
import {
  GetJobs,
  GetJobById,
  GetJobsExpectations,
  CreateJobExpectations,
  UpdateJobExpectations,
} from "../../Redux/Jobs/JobsActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import "./Jobs.css";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  return (
    <div className={"rootStyle"}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
function Row(props) {
  const { job, expectations } = props;
  const [jobExpect, setJobExpect] = useState(
    expectations.find((expect) => expect.jobId === job.id)
  );
  const [modOpen, setModOpen] = useState(false);
  const [editModOpen, setEditModOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [expectPost, setExpectPost] = useState({
    days: 0,
    hours: 0,
    jobId: job.id,
  });
  const [expectPut, setExpectPut] = useState({
    days: 0,
    hours: 0,
    jobId: job.id,
    id: 0,
  });
  useEffect(() => {
    if (jobExpect != null) {
      setExpectPut((prevState) => {
        let retData = { ...prevState };
        retData.days = jobExpect.days;
        retData.hours = jobExpect.hours;
        retData.id = jobExpect.id;
        return retData;
      });
    }
  }, []);
  const convertTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(date));
  };
  const submitExpect = (jbsExpect, type) => {
    if (type === "post") {
      setModOpen(false);
      props.expectations.push(jbsExpect);
      setJobExpect(jbsExpect);
      props.PostExpect(jbsExpect);
    } else if (type === "put") {
      setEditModOpen(false);
      const index = props.expectations.indexOf(jobExpect);
      props.expectations[index] = jbsExpect;
      setJobExpect(jbsExpect);
      props.PutExpect(jbsExpect);
    }
  };
  const formatExpect = (event, field, type) => {
    const value = event.target.value;
    if (field === "d") {
      if (type === "post") {
        setExpectPost((prevState) => {
          let retData = { ...prevState };
          retData.days = parseInt(value);
          return retData;
        });
      } else if (type === "put") {
        setExpectPut((prevState) => {
          let retData = { ...prevState };
          retData.days = parseInt(value);
          return retData;
        });
      }
    } else if (field === "h") {
      if (type === "post") {
        setExpectPost((prevState) => {
          let retData = { ...prevState };
          retData.hours = parseInt(value);
          return retData;
        });
      } else if (type === "put") {
        setExpectPut((prevState) => {
          let retData = { ...prevState };
          retData.hours = parseInt(value);
          return retData;
        });
      }
    }
  };
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {job.description}
        </TableCell>
        <TableCell align="right">{convertTime(job.lastSuccess)}</TableCell>
        <TableCell align="right">
          {convertTime(job.lastExecutionDate)}
        </TableCell>
        <TableCell align="right">{job.lastExecutionStatus}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {jobExpect != null ? (
                <div>
                  <div className={"subHeadFormat"}>
                    <Typography variant="h6" gutterBottom component="div">
                      Expectations
                    </Typography>
                    <Modal
                      onClose={() => setEditModOpen(false)}
                      onOpen={() => setEditModOpen(true)}
                      open={editModOpen}
                      className={"Semantic-Mod"}
                      trigger={
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => setEditModOpen(true)}
                        >
                          <EditIcon />
                        </IconButton>
                      }
                    >
                      <Modal.Header>
                        Expectations for {job.description}
                      </Modal.Header>
                      <Modal.Content className={"placementCont"}>
                        <TextField
                          className={"paddingTextField"}
                          label={"Days Expected"}
                          defaultValue={jobExpect.days}
                          onChange={(e) => formatExpect(e, "d", "put")}
                        />
                        <TextField
                          className={"paddingTextField"}
                          label={"Hours Expected"}
                          defaultValue={jobExpect.hours}
                          onChange={(e) => formatExpect(e, "h", "put")}
                        />
                      </Modal.Content>
                      <Modal.Actions>
                        <Button
                          color="red"
                          onClick={() => setEditModOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          color="green"
                          onClick={() => submitExpect(expectPut, "put")}
                        >
                          Set Expectations
                        </Button>
                      </Modal.Actions>
                    </Modal>
                  </div>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell>Days</TableCell>
                        <TableCell>Hours</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{jobExpect.days}</TableCell>
                        <TableCell>{jobExpect.hours}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div>
                  <Typography variant="h6" gutterBottom component="div">
                    Expectations
                  </Typography>
                  <Typography>
                    No Expectations set.{" "}
                    <Modal
                      onClose={() => setModOpen(false)}
                      onOpen={() => setModOpen(true)}
                      open={modOpen}
                      className={"Semantic-Mod"}
                      trigger={
                        <Typography
                          className={"clickPoint"}
                          component={"a"}
                          onClick={() => setModOpen(true)}
                        >
                          Click here to add some.
                        </Typography>
                      }
                    >
                      <Modal.Header>
                        Creating Expectations for {job.description}
                      </Modal.Header>
                      <Modal.Content className={"placementCont"}>
                        <TextField
                          className={"paddingTextField"}
                          label={"Days Expected"}
                          defaultValue={"0"}
                          onChange={(e) => formatExpect(e, "d", "post")}
                        />
                        <TextField
                          className={"paddingTextField"}
                          label={"Hours Expected"}
                          defaultValue={"0"}
                          onChange={(e) => formatExpect(e, "h", "post")}
                        />
                      </Modal.Content>
                      <Modal.Actions>
                        <Button color="red" onClick={() => setModOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          color="green"
                          onClick={() => submitExpect(expectPost, "post")}
                        >
                          Set Expectations
                        </Button>
                      </Modal.Actions>
                    </Modal>
                  </Typography>
                </div>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
});

function JobsTable(props) {
  const { jobs, expectations } = props;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, jobs.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer>
      <Table aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Job</TableCell>
            <TableCell align="right">Last Success</TableCell>
            <TableCell align="right">Last Execution Date</TableCell>
            <TableCell align="right">Last Execution Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : jobs
          ).map((job) => (
            <Row
              key={job.id}
              job={job}
              expectations={props.expectations}
              PostExpect={props.postExp}
              PutExpect={props.putJobExp}
            />
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter className={"tableFoot"}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            count={jobs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            SelectProps={{
              inputProps: { "aria-label": "rows per page" },
              native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

const Jobs = (props) => {
  useEffect(() => {
    props.GetJobs();
    props.GetJobExpectations();
  }, []);
  return (
    <Paper>
      <Toolbar>
        <Typography
          className={"tableTitle"}
          variant="h6"
          id="tableTitle"
          component="div"
          style={{ color: "#144a6f" }}
        >
          Jobs
        </Typography>
      </Toolbar>
      <JobsTable
        jobs={props.jobs}
        expectations={props.jobsExpect}
        postExp={props.PostJobExpect}
        putJobExp={props.PutJobExpect}
      />
    </Paper>
  );
};
function mapStateToProps(state) {
  return {
    jobs: state.JobsReducer.jobs,
    jobsById: state.JobsReducer.jobById,
    jobsExpect: state.JobsReducer.jobsExpect,
    jobsLoading: state.JobsReducer.jobsLoading,
    jobsError: state.JobsReducer.jobsError,
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    GetJobs: () => {
      dispatch(GetJobs());
    },
    GetJobById: () => {
      dispatch(GetJobById());
    },
    GetJobExpectations: () => {
      dispatch(GetJobsExpectations());
    },
    PostJobExpect: (jobExpect) => {
      dispatch(CreateJobExpectations(jobExpect));
    },
    PutJobExpect: (jobExpect) => {
      dispatch(UpdateJobExpectations(jobExpect));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Jobs);
