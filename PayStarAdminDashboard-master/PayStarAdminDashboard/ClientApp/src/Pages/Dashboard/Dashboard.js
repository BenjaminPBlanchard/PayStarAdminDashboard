import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { connect } from "react-redux";
import { GetClients, GetClientStats } from "../../Redux/Clients/ClientsActions";
import Loading from "../../Components/Loading/Loading";
import HubspotFeed from "../../Components/HubspotFeed/HubspotFeed";
import { Card, CardContent, Grid } from "@material-ui/core";
import { Statistic, Divider, Icon, Dropdown } from "semantic-ui-react";
import Typography from "@material-ui/core/Typography";
import { GetJobsCount } from "../../Redux/Jobs/JobsActions";
import { getRecentNotes } from "../../Redux/Notes/NotesActions";
import { getAllUsers } from "../../Redux/Users/UsersActions";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";

const Dashboard = (props) => {
  const [isBusy, setIsBusy] = useState(true);
  useEffect(() => {
    props.GetClientStats();
    props.GetJobsCount();
    props.GetRecentNotes();
    props.GetClients();
    props.getAllUsers();
    setIsBusy(false);
  }, []);
  const clientNotes = props.recentNotes.reverse();
  return (
    <div className={"sidebyside"}>
      <HubspotFeed />
      <div>
        <StatsCard statistics={props.clientsStats} />
        <JobsCard jobStats={props.jobsCount} />
      </div>
      <NotesCard
        recentNotes={clientNotes}
        users={props.allUsers}
        clients={props.clients}
      />
    </div>
  );
};
function NotesCard(props) {
  const history = useHistory();
  const findUserById = (id) => {
    return props.users.find((user) => user.id === id);
  };
  const findClientById = (id) => {
    return props.clients.find((client) => client.id === id);
  };
  return (
    <div className={"noteMainContainer"}>
      <h1 className={"cardTitle"}>
        <Icon name={"sticky note outline"} />
        Recent Client Notes
      </h1>
      <div className={"noteCardBorder"}>
        {props.recentNotes != null &&
          props.recentNotes.map((note, index) => (
            <Paper elevation={2} key={index} className={"notePaperFormat"}>
              <Grid container>
                <Grid item container direction={"column"} spacing={1}>
                  <Grid item>
                    <div className={"noteCardHeader"}>
                      <Typography
                        component={"div"}
                        className={"RecNote-header"}
                      >
                        {findUserById(note.userId) != null &&
                          findUserById(note.userId).userName}
                      </Typography>
                      <Typography
                        component={"div"}
                        className={"RecNote-header clickPoint"}
                        onClick={() => history.push(`clients/${note.clientId}`)}
                      >
                        {findClientById(note.clientId) != null &&
                          findClientById(note.clientId).name}
                      </Typography>
                    </div>
                    <Typography
                      gutterBottom
                      component={"div"}
                      className={"noteCardItemBody"}
                    >
                      {note.content}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      color={"textSecondary"}
                      className={"noteCardItemBody"}
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
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          ))}
      </div>
    </div>
  );
}
function StatsCard(props) {
  return (
    <div>
      <h1 className={"cardTitle"}>
        <Icon name={"chart bar"} />
        Transaction Info
      </h1>

      <Card className={"cardBorder"}>
        <CardContent>
          <Statistic.Group>
            <Statistic size={"small"}>
              <Statistic.Label style={{ color: "#144a6f" }}>
                {" "}
                Total Transactions
              </Statistic.Label>
              {props.statistics.transactionCountTotal != null ? (
                <Statistic.Value>
                  {props.statistics.transactionCountTotal.toLocaleString()}
                </Statistic.Value>
              ) : (
                <Typography>No transactions found</Typography>
              )}

              <Divider />

              <Statistic.Label style={{ color: "#144a6f" }}>
                {" "}
                Total Revenue
              </Statistic.Label>
              {props.statistics.revenueTotal != null ? (
                <Statistic.Value>
                  ${props.statistics.revenueTotal.toLocaleString()}
                </Statistic.Value>
              ) : (
                <Typography> Net revenue not found</Typography>
              )}
            </Statistic>
          </Statistic.Group>
        </CardContent>
      </Card>
    </div>
  );
}
function JobsCard(props) {
  const history = useHistory();
  return (
    <div>
      <h1
        className={"cardTitle clickPoint"}
        onClick={() => {
          history.push(`/jobs`);
        }}
      >
        <Icon name={"tasks"} />
        Jobs Statuses
      </h1>

      <Card className={"cardBorder"}>
        <CardContent>
          <Statistic size={"small"} horizontal color={"green"}>
            {props.jobStats.succeded != null ? (
              <Statistic.Value>{props.jobStats.succeded}</Statistic.Value>
            ) : (
              <Statistic.Value>Jobs not found</Statistic.Value>
            )}
            <Statistic.Label> Jobs Succeeded</Statistic.Label>
          </Statistic>
          <Divider />
          <Statistic size={"small"} horizontal color={"red"}>
            {props.jobStats.failed != null ? (
              <Statistic.Value>{props.jobStats.failed}</Statistic.Value>
            ) : (
              <Statistic.Value> Jobs not found</Statistic.Value>
            )}
            <Statistic.Label> Jobs Failed</Statistic.Label>
          </Statistic>
        </CardContent>
      </Card>
    </div>
  );
}
function mapStateToProps(state) {
  return {
    clientsStats: state.ClientsReducer.clientsStats,
    clientsLoading: state.ClientsReducer.clientsLoading,
    clients: state.ClientsReducer.clients,
    jobsCount: state.JobsReducer.jobsCount,
    recentNotes: state.NotesReducer.recentNotes,
    allUsers: state.UsersReducer.allUsers,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    GetClientStats: () => {
      dispatch(GetClientStats());
    },
    GetJobsCount: () => {
      dispatch(GetJobsCount());
    },
    GetRecentNotes: () => {
      dispatch(getRecentNotes());
    },
    getAllUsers: () => {
      dispatch(getAllUsers());
    },
    GetClients: () => {
      dispatch(GetClients());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
