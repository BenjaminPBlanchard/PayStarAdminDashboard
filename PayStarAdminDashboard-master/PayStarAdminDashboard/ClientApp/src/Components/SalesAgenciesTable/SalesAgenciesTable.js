import React, { useState } from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";

import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import { Button, Dropdown, Icon, Input, Modal } from "semantic-ui-react";
import matchSorter from "match-sorter";
import { TextField } from "@material-ui/core";
import "./SalesAgenciesTable.css";
import Axios from "axios";
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
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Sales Agency Name",
  },
  /*{
    id: "phoneNumber",
    numeric: true,
    disablePadding: true,
    label: "Phone Number",
  },
  {
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
    label: "Area Code",
  },
  {
    id: "versionOneId",
    numeric: false,
    disablePadding: true,
    label: "Version",
  },
  {
    id: "isMigrating",
    numeric: false,
    disablePadding: true,
    label: "Migrating",
  },*/
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
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
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
  onSelectAllClick: PropTypes.func.isRequired,
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
  const [postAgency, setPostAgency] = useState({
    name: "",
  });
  const [modOpen, setModOpen] = useState(false);
  const formatAgencyState = (event) => {
    const value = event.target.value;
    setPostAgency((prevState) => {
      let returnData = { ...prevState };
      returnData.name = value;
      return returnData;
    });
  };
  const onSubmit = (newAgency) => {
    if (newAgency.name.length === 0) {
      alert("Missing required fields");
    } else {
      setModOpen(false);
      props.SetAgencies((agencies) => {
        let retData = [...agencies];
        retData = [...retData, newAgency];
        return retData;
      });
      props.setTable((agencies) => {
        let retData = [...agencies];
        retData = [...retData, newAgency];
        return retData;
      });
      Axios.post(`/api/sales-agency`, newAgency)
        .then((res) => {
          if (res.status === 200) {
            console.log("Sales Agency created: " + res.data);
          }
        })
        .catch((res) => {
          console.log(res);
        });
    }
  };
  const { numSelected } = props;
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
        Sales Agencies
      </Typography>
      <Modal
        onClose={() => setModOpen(false)}
        onOpen={() => setModOpen(true)}
        open={modOpen}
        className={"Semantic-Modal"}
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
        <Modal.Header>Create New Sales Agency</Modal.Header>
        <Modal.Content className={"placementContain"}>
          <TextField
            required
            helperText={"Required."}
            label={"Sales Agency Name"}
            className={"paddingTextField"}
            style={{ width: 300 }}
            onChange={(e) => formatAgencyState(e)}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setModOpen(false)}>
            Cancel
          </Button>
          <Button color="green" onClick={() => onSubmit(postAgency)}>
            Submit Agency
          </Button>
        </Modal.Actions>
      </Modal>
      <Input
        placeholder="Search Sales agencies..."
        onChange={props.handleChange}
        icon={"search"}
      />
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
const SalesAgenciesTable = (props) => {
  const classes = useStyles(),
    [order, setOrder] = useState("asc"),
    [orderBy, setOrderBy] = useState("name"),
    [selected, setSelected] = useState([]),
    [page, setPage] = useState(0),
    [rowsPerPage, setRowsPerPage] = useState(10),
    [tableData, setTableData] = useState(props.salesAgencies),
    [query, setQuery] = useState(""),
    handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    },
    handleSelectAllClick = (event) => {
      if (event.target.checked) {
        const newSelecteds = props.salesAgencies.map((n) => n.name);
        setSelected(newSelecteds);
        return;
      }
      setSelected([]);
    },
    history = useHistory(),
    handleClick = (event, id) => {
      history.push(`/sales-agencies/${id}`);
    },
    handleChangePage = (event, newPage) => {
      setPage(newPage);
    },
    handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    isSelected = (name) => selected.indexOf(name) !== -1,
    handleQueryChange = (event) => {
      setQuery(event.target.value);
      console.log(props.salesAgencies);
      setTableData(
        matchSorter(props.salesAgencies, event.target.value, {
          keys: ["name"],
        })
      );
    },
    emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, tableData.length - page * rowsPerPage);
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleChange={handleQueryChange}
          setTable={setTableData}
          SetAgencies={props.setSalesAgencies}
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
              onSelectAllClick={handleSelectAllClick}
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
                      {/* <TableCell>{row.phoneNumber}</TableCell>
                      <TableCell>{row.ivrPhoneNumber}</TableCell>
                      <TableCell>{row.billingSystem}</TableCell>
                      <TableCell>{row.streetAddress}</TableCell>
                      <TableCell>{row.city}</TableCell>
                      <TableCell>{row.zip}</TableCell>
                      <TableCell>{row.versionOneId ? "v1" : "v2"}</TableCell>
                      <TableCell>
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
export default SalesAgenciesTable;
