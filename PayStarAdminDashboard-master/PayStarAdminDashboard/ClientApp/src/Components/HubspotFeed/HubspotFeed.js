import React, { useEffect, useLayoutEffect } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import "./HubspotFeed.css";
import { connect } from "react-redux";

import {
  getContacts,
  getEngagements,
} from "../../Redux/Hubspot/HubspotActions";
import { Icon, Dropdown, Menu } from "semantic-ui-react";

const HubspotFeed = (props) => {
  let currentContact = {};
  const engageArr = props.engagements;
  const contactsArr = props.contacts;
  useLayoutEffect(() => {
    props.getEngagements();
    props.getContacts();
    return () => {};
  }, []);

  const findContactById = (id) => {
    currentContact = contactsArr.find((d) => d.vid === id);
  };

  const findContactsByArr = (arr) => {
    const retArr = [];
    arr.map((idNum) => {
      findContactById(idNum);
      retArr.push(currentContact);
    });
    return retArr;
  };

  const hSpotPortalId = () => {
    if (engageArr[0]) {
      return engageArr[0].engagement.portalId;
    }
  };

  return (
    <div className={"main"}>
      <h1 className={"hubTitle"}>
        <a
          href={"https://app.hubspot.com/activity-feed/" + hSpotPortalId()}
          target={"_blank"}
        >
          <Icon name="hubspot" color={"orange"} link />
        </a>
        Hubspot Feed
      </h1>
      <div className={"gridFormat"}>
        {engageArr != null &&
          currentContact != null &&
          engageArr.map((data) => (
            <Paper
              className={"paperFormat"}
              elevation={2}
              key={data.engagement.id}
            >
              <Grid container>
                <Grid item xs container direction={"column"} spacing={1}>
                  <Grid item xs>
                    <Typography component={"div"} className={"paperHeader"}>
                      <p>{data.engagement.type}</p>{" "}
                      <div>
                        <Dropdown text={"Contacts"} direction={"left"}>
                          <Dropdown.Menu>
                            {findContactsByArr(data.associations.contactIds) !=
                              null &&
                              findContactsByArr(
                                data.associations.contactIds
                              ).map((contact) => (
                                <Dropdown.Item
                                  text={
                                    contact != null &&
                                    contact.properties.firstname.value +
                                      " " +
                                      contact.properties.lastname.value
                                  }
                                  key={contact != null && contact.vid}
                                  href={contact != null && contact.profileurl}
                                  target={"_blank"}
                                />
                              ))}
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Typography>
                    <Typography
                      variant={"body2"}
                      gutterBottom
                      component={"div"}
                    >
                      {data.engagement.type === "TASK" && (
                        <p>
                          Subject:&nbsp;
                          {data.metadata.subject}
                        </p>
                      )}
                      {data.engagement.type === "CALL" && (
                        <p>
                          Dialed:&nbsp;
                          {data.metadata.toNumber}
                        </p>
                      )}
                      {data.engagement.type === "MEETING" && (
                        <p>
                          Title:&nbsp;
                          {data.metadata.title}
                        </p>
                      )}
                      {data.engagement.type === "INCOMING_EMAIL" && (
                        <p>
                          Subject:&nbsp;
                          {data.metadata.subject}
                        </p>
                      )}
                      {data.engagement.type === "EMAIL" && (
                        <p>
                          Subject:&nbsp;
                          {data.metadata.subject}
                        </p>
                      )}
                    </Typography>
                    <Typography
                      variant={"body2"}
                      gutterBottom
                      component={"div"}
                    >
                      {data.engagement.type === "TASK" && (
                        <p>
                          Status:&nbsp;
                          {data.metadata.status}
                        </p>
                      )}
                      {data.engagement.type === "CALL" && (
                        <p>
                          Status:&nbsp;
                          {data.metadata.status}
                        </p>
                      )}
                      {data.engagement.type === "MEETING" && (
                        <p>
                          Purpose:&nbsp;
                          {data.engagement.bodyPreview}
                        </p>
                      )}
                      {data.engagement.type === "NOTE" && (
                        <p>
                          Content:&nbsp;
                          {data.engagement.bodyPreview}
                        </p>
                      )}
                      {data.engagement.type === "INCOMING_EMAIL" && (
                        <p>
                          From:&nbsp;
                          {data.metadata.from.email}
                        </p>
                      )}
                      {data.engagement.type === "EMAIL" && (
                        <p>
                          To:&nbsp;
                          {data.metadata.to[0].email}
                        </p>
                      )}
                    </Typography>
                    <Typography
                      variant={"body2"}
                      gutterBottom
                      component={"div"}
                    >
                      {data.engagement.type === "TASK" && (
                        <p>
                          Due by:&nbsp;
                          {data.scheduledTasks[0] !== undefined &&
                            new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                              hour: "numeric",
                              minute: "2-digit",
                              second: "2-digit",
                            }).format(
                              new Date(data.scheduledTasks[0].timestamp)
                            )}
                        </p>
                      )}
                      {data.engagement.type === "MEETING" && (
                        <p>
                          Scheduled Time:&nbsp;
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "2-digit",
                            second: "2-digit",
                          }).format(new Date(data.metadata.startTime))}
                        </p>
                      )}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant={"body2"} color={"textSecondary"}>
                      Last Updated:&nbsp;{" "}
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                      }).format(new Date(data.engagement.lastUpdated))}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          ))}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    engagements: state.HubspotReducer.engagementsResults,
    contacts: state.HubspotReducer.contactsResults,
    engagementsLoading: state.HubspotReducer.engagementsLoading,
    contactsLoading: state.HubspotReducer.contactsLoading,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getEngagements: () => {
      dispatch(getEngagements());
    },
    getContacts: () => {
      dispatch(getContacts());
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HubspotFeed);
