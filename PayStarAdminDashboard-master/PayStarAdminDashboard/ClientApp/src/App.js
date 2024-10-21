import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import TopNav from "./Components/TopNav/TopNav";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Clients from "./Pages/Clients/Clients";
import ClientInformation from "./Pages/ClientInformation/ClientInformation";
import SalesAgencies from "./Pages/SalesAgencies/SalesAgencies";
import Reports from "./Pages/Reports/Reports";
import Jobs from "./Pages/Jobs/Jobs";
import Login from "./Pages/Login/Login";
import SalesAgencyInformation from "./Pages/SalesAgencyInformation/SalesAgencyInformation";
import "./App.css";
import PrivateRoute from "./Components/RBA/PrivateRoute";
import SideNav from "./Components/SideNav/SideNav";

function App() {
  return (
    <BrowserRouter>
      <TopNav />
      <Switch>
        <Route exact path={"/"} component={Login} />
        <Route path={"/"}>{/*<SideNav />*/}</Route>
      </Switch>
      <div className={"innerMargins"}>
        <PrivateRoute exact path={"/dashboard"} component={Dashboard} />
        <PrivateRoute exact path={"/clients"} component={Clients} />
        <PrivateRoute
          exact
          path={"/clients/:id"}
          component={ClientInformation}
        />
        <PrivateRoute
          exact
          path={"/sales-agencies"}
          component={SalesAgencies}
        />
        <PrivateRoute
          exact
          path={"/sales-agencies/:id"}
          component={SalesAgencyInformation}
        />
        <PrivateRoute exact path={"/jobs"} component={Jobs} />
      </div>
    </BrowserRouter>
  );
}

export default App;
