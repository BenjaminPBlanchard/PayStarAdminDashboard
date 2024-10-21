import React, { useState } from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Toolbar,
  Typography,
  TextField,
} from "@material-ui/core";
import "./ClientsTable.css";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import { Input, Button, Icon, Modal, Dropdown } from "semantic-ui-react";
import matchSorter from "match-sorter";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Client Name" },
  {
    id: "phoneNumber",
    numeric: true,
    disablePadding: true,
    label: "Phone Number",
  },
  /*{
    id: "ivrPhoneNumber",
    numeric: true,
    disablePadding: true,
    label: "IVR Number",
  },
  {
    id: "billingSystem",
    numeric: false,
    disablePadding: true,
    label: "Billing System",
  },
  {
    id: "streetAddress",
    numeric: true,
    disablePadding: true,
    label: "Address",
  },
  {
    id: "city",
    numeric: true,
    disablePadding: true,
    label: "City",
  },
  {
    id: "zip",
    numeric: false,
    disablePadding: true,
    label: "Zip Code",
  },*/
  {
    id: "versionOneId",
    numeric: false,
    disablePadding: true,
    label: "Version",
  },
  /*{
    id: "isMigrating",
    numeric: false,
    disablePadding: true,
    label: "Migrating",
  },*/ {
    id: "paymentButton",
    numeric: true,
    disablePadding: true,
    label: "Payment",
  },
];
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headcell) => (
          <TableCell
            key={headcell.id}
            paddinhg={headcell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headcell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headcell.id}
              direction={orderBy === headcell.id ? order : "asc"}
              onClick={createSortHandler(headcell.id)}
            >
              {headcell.label}
              {orderBy === headcell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));
const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const [modOpen, setModOpen] = useState(false);
  const [postClient, setPostClient] = useState({
    ivrPhoneNumber: "",
    phoneNumber: "",
    name: "",
    billingSystem: "",
    versionOneId: "",
    versionTwoId: "",
    isMigrating: true,
    streetAddress: "",
    state: "",
    city: "",
    zip: "",
    revenue: "",
  });
  const numSelected = 0;
  const onSubmit = (newClient) => {
    if (newClient.name.length === 0) {
      alert("Missing required fields");
    } else {
      setModOpen(false);
      props.setClients((clients) => {
        let retData = [...clients];
        retData = [...retData, newClient];
        return retData;
      });
      props.PostClient(newClient);
    }
  };
  const formatClientState = (event, field) => {
    let value;
    if (field !== "isMigrating") {
      value = event.target.value;
    }
    switch (field) {
      case "ivrPhoneNumber":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.ivrPhoneNumber = value;
          return returnData;
        });
      case "phoneNumber":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.phoneNumber = value;
          return returnData;
        });
      case "billingSystem":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.billingSystem = value;
          return returnData;
        });
      case "city":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.city = value;
          return returnData;
        });
      case "name":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.name = value;
          return returnData;
        });
      case "isMigrating":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.isMigrating = JSON.parse(event);
          return returnData;
        });
      case "streetAddress":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.streetAddress = value;
          return returnData;
        });
      case "versionOneId":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.versionOneId = value;
          return returnData;
        });
      case "versionTwoId":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.versionTwoId = value;
          return returnData;
        });
      case "zip":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.zip = value;
          return returnData;
        });
      case "state":
        return setPostClient((prevState) => {
          let returnData = { ...prevState };
          returnData.state = value;
          return returnData;
        });
    }
  };
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Typography
        className={classes.title}
        variant="h6"
        id="tableTitle"
        component="div"
        style={{ color: "#144a6f" }}
      >
        Clients
      </Typography>
      <Modal
        onClose={() => setModOpen(false)}
        onOpen={() => setModOpen(true)}
        open={modOpen}
        className={"Semantic-ModalClients"}
        trigger={
          <Icon
            name={"add square"}
            size={"large"}
            color={"grey"}
            link
            style={{ paddingRight: 10 }}
          />
        }
      >
        <Modal.Header>Create New Client</Modal.Header>
        <Modal.Content className={"placementModal"}>
          <TextField
            required
            helperText={"Required."}
            label={"Client Name"}
            className={"paddingTextField"}
            style={{ width: 300 }}
            onChange={(e) => formatClientState(e, "name")}
          />
          <TextField
            label={"Billing System"}
            className={"paddingTextField"}
            style={{ width: 200 }}
            onChange={(e) => formatClientState(e, "billingSystem")}
          />
          <TextField
            label={"Phone Number"}
            className={"paddingTextField"}
            style={{ width: 200 }}
            onChange={(e) => formatClientState(e, "phoneNumber")}
          />
          <TextField
            label={"IVR Phone Number"}
            className={"paddingTextField"}
            style={{ width: 200 }}
            onChange={(e) => formatClientState(e, "ivrPhoneNumber")}
          />
          <TextField
            label={"Street Address"}
            className={"paddingTextField"}
            style={{ width: 300 }}
            onChange={(e) => formatClientState(e, "streetAddress")}
          />
          <TextField
            label={"City"}
            className={"paddingTextField"}
            style={{ width: 200 }}
            onChange={(e) => formatClientState(e, "city")}
          />
          <TextField
            label={"Zip Code"}
            className={"paddingTextField"}
            style={{ width: 200 }}
            onChange={(e) => formatClientState(e, "zip")}
          />
          <TextField
            label={"State"}
            className={"paddingTextField"}
            style={{ width: 200 }}
            onChange={(e) => formatClientState(e, "state")}
          />
          <TextField
            label={"Version One Id"}
            className={"paddingTextField"}
            style={{ width: 200 }}
            onChange={(e) => formatClientState(e, "versionOneId")}
          />
          <TextField
            label={"Version Two Id"}
            className={"paddingTextField"}
            style={{ width: 200 }}
            onChange={(e) => formatClientState(e, "versionTwoId")}
          />
          <Dropdown
            selection
            style={{ minWidth: 200 }}
            className={"dropDownPads"}
            placeholder={"is Migrating"}
            options={[
              { key: "true", text: "true", value: "true" },
              { key: "false", text: "false", value: "false" },
            ]}
            onChange={(e, data) => formatClientState(data.value, "isMigrating")}
          />
        </Modal.Content>
        <Modal.Actions style={{ marginTop: 120 }}>
          <Button color="red" onClick={() => setModOpen(false)}>
            Cancel
          </Button>
          <Button color="green" onClick={() => onSubmit(postClient)}>
            Submit Client
          </Button>
        </Modal.Actions>
      </Modal>

      <Input
        placeholder="Search clients..."
        onChange={props.handleChange}
        icon={"search"}
      />
    </Toolbar>
  );
};

const ClientsTable = (props) => {
  let classes;
  classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState(props.clients);
  const [query, setQuery] = useState("");
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const history = useHistory();
  const handleClick = (event, id) => {
    history.push(`/clients/${id}`);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const handleQueryChange = (event) => {
    setQuery(event.target.value);
    setTableData(
      matchSorter(props.clients, event.target.value, {
        keys: [
          "name",
          /* "billingSystem",
          "zip",
          "city",
          "streetAddress",
          "phoneNumber",
          "ivrPhoneNumber",*/
        ],
      })
    );
  };
  const handlePaymentClick = (e, client) => {
    e.stopPropagation();
    if (client.versionTwoId != null && client.versionTwoId.length !== 0) {
      window.open(
        `https://secure.paystar.io/app/customer/${client.versionTwoId}`
      );
    } else if (
      client.versionOneId != null &&
      client.versionOneId.length !== 0
    ) {
      window.open(
        ` https://www.paystar.co/MakePayment/SubInput/${client.versionOneId}`
      );
    } else {
      alert("No version id set.");
    }
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, tableData.length - page * rowsPerPage);
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          handleChange={handleQueryChange}
          setClients={setTableData}
          PostClient={props.PostClient}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={tableData.length}
            />
            <TableBody>
              {stableSort(tableData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                      onClick={(event) => handleClick(event, row.id)}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding={"default"}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell>{row.phoneNumber}</TableCell>
                      {/*<TableCell>{row.ivrPhoneNumber}</TableCell>
                      <TableCell>{row.billingSystem}</TableCell>
                      <TableCell>{row.streetAddress}</TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell>{row.zip}</TableCell>*/}
                      <TableCell>{row.versionTwoId ? "v2" : "v1"}</TableCell>
                      <TableCell>
                        <Button
                          content={"Collect Payment"}
                          primary
                          onClick={(e) => handlePaymentClick(e, row)}
                        />
                      </TableCell>
                      {/*<TableCell>
                        {row.isMigrating ? "true" : "false"}
                      </TableCell>*/}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};
export default ClientsTable;
