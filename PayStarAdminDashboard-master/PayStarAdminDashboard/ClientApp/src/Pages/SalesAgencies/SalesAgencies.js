import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "semantic-ui-react";

import "./SalesAgencies.css";
import SalesAgenciesTable from "../../Components/SalesAgenciesTable/SalesAgenciesTable";
import Loading from "../../Components/Loading/Loading";

const SalesAgencies = () => {
  const [salesAgencyArr, setSalesAgencyArr] = useState([]);
  const [isBusy, setIsBusy] = useState(true);

  useEffect(() => {
    axios
      .get("/api/sales-agency")
      .then((r) => {
        setSalesAgencyArr(r.data);
      })
      .finally(() => {
        setIsBusy(false);
      });
  }, []);

  return (
    <div>
      {!isBusy ? (
        <SalesAgenciesTable
          salesAgencies={salesAgencyArr}
          setSalesAgencies={setSalesAgencyArr}
        />
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default SalesAgencies;
