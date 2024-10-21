import React, { useState, forwardRef, useEffect } from "react";
import Divider from "@material-ui/core/Divider";
import MaterialTable, {
  MTableAction,
  MTableActions,
  MTablePagination,
  MTableToolbar,
} from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import CustomSwitch from "../CustomSwitch/CustomSwitch";
import "./ContactsTable.css";
import { FilterCenterFocusTwoTone } from "@material-ui/icons";
import axios from "axios";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

// Takes in Contacts json as props
const ContactsTable = (props) => {
  const [tableState, setTableState] = useState({
    columns: [
      {
        title: "Primary",
        field: "isPrimary",
        lookup: { true: "true", false: "false" },
      },
      { title: "Name", field: "name" },
      { title: "Role", field: "title" },
      { title: "Mobile Phone", field: "mobilePhoneNumber" },
      { title: "Office Phone", field: "officePhoneNumber" },
    ],
    data: [],
  });
  useEffect(() => {
    axios.get(`/api/contact/GetByClientId/` + props.ClientId).then((r) => {
      setTableState((table) => {
        const callData = { ...table };
        r.data.map((d) => {
          if (d.isDeleted === false) {
            callData.data = [...callData.data, d];
          }
        });
        return callData;
      });
    });
  }, []);

  const formatState = (myData, call) => {
    let newData;
    newData = {
      Name: myData.name,
      IsPrimary: JSON.parse(myData.isPrimary),
      IsDeleted: false,
      Title: myData.title,
      OfficePhoneNumber: myData.officePhoneNumber,
      MobilePhoneNumber: myData.mobilePhoneNumber,
      ClientId: parseInt(props.ClientId),
    };

    if (call === "post") {
      axiosPostCall(newData);
    } else if (call === "put") {
      axiosPutCall(newData, myData.id);
    } else if (call === "delete") {
      axiosDelCall(newData, myData.id);
    }
  };
  const axiosPostCall = (postData) => {
    axios
      .post("/api/contact", postData)
      .then((r) => {
        console.log(r);
      })
      .catch((res) => {
        console.log(res);
      });
  };
  const axiosPutCall = (putData, id) => {
    if (id !== 0) {
      axios
        .put(`/api/contact?id=${id}`, putData)
        .then((r) => {
          console.log(r);
        })
        .catch((res) => {
          console.log(res);
        });
    }
  };
  const axiosDelCall = (oldData, id) => {
    oldData.IsDeleted = true;
    console.log(oldData);
    axios
      .put(`/api/contact?id=${id}`, oldData)
      .then((r) => {
        console.log(r);
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={tableState.columns}
        data={tableState.data}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                if (newData.isPrimary) {
                  setTableState((data) => {
                    let retData = { ...data };
                    retData.data = [...retData.data, newData];
                    return retData;
                  });
                  formatState(newData, "post");
                }
                resolve();
              }, 1000);
            }),

          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                const dataUpdate = [...tableState.data];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setTableState((data) => {
                  let retData = { ...data };
                  retData.data = [...dataUpdate];
                  return retData;
                });
                formatState(newData, "put");
                resolve();
              }, 1000);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                const delData = [...tableState.data];
                const index = oldData.tableData.id;
                delData.splice(index, 1);
                setTableState((data) => {
                  let retData = { ...data };
                  retData.data = [...delData];
                  return retData;
                });
                formatState(oldData, "delete");
                resolve();
              }, 1000);
            }),
        }}
        title="Contacts"
      />
    </div>
  );
};

export default ContactsTable;
