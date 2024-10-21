import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { loginUser, logoutUser } from "../../Redux/Auth/AuthActions";
import "./TopNav.css";
import logo from "../../Resources/Paystar_logo.png";
import { useHistory, Redirect } from "react-router-dom";
import GlobalSearchBar from "../GlobalSearchBar/GlobalSearchBar";
import IconButton from "@material-ui/core/IconButton";
import { AccountCircle } from "@material-ui/icons";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const TopNav = (props) => {
  const history = useHistory();
  const onLoginClick = () => {
    history.push("/");
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    props.logoutUser();
    handleClose();
  };

  return (
    <div>
      <AppBar position={"sticky"}>
        <Toolbar>
          <img
            src={logo}
            alt={""}
            className={"logo"}
            onClick={() => history.push("/dashboard")}
          />
          {props.auth.user.username ? (
            <div className={"btn-group"}>
              <div
                className={"nav-btn hvr-underline-from-center"}
                onClick={() => {
                  history.push("/dashboard");
                }}
              >
                DASHBOARD
              </div>
              <div
                className={"nav-btn hvr-underline-from-center"}
                onClick={() => {
                  history.push("/clients");
                }}
              >
                CLIENTS
              </div>
              <div
                className={"nav-btn hvr-underline-from-center"}
                onClick={() => {
                  history.push("/sales-agencies");
                }}
              >
                SALES AGENCIES
              </div>
              <div
                className={"nav-btn hvr-underline-from-center"}
                onClick={() => {
                  history.push("/jobs");
                }}
              >
                JOBS
              </div>

              <GlobalSearchBar />
            </div>
          ) : null}
          {props.auth.user.username ? (
            <div className={"greeting"}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                size={"medium"}
              >
                <AccountCircle
                  fontSize={"large"}
                  style={{ color: "#144a6f" }}
                />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                keepMounted
                getContentAnchorEl={null}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                open={open}
                onClose={handleClose}
                disableScrollLock={true}
              >
                <MenuItem disabled>{props.auth.user.username}</MenuItem>
                <MenuItem
                  onClick={() =>
                    window.open(`${window.location.origin}/hangfire`)
                  }
                  style={{ color: "#144a6f" }}
                >
                  Hangfire
                </MenuItem>
                <MenuItem onClick={handleLogOut} style={{ color: "#144a6f" }}>
                  Log Out
                </MenuItem>
              </Menu>
            </div>
          ) : props.auth.isAuthenticated ? (
            <Button
              onClick={onLoginClick}
              color={"inherit"}
              className={"login"}
            >
              Login
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
    </div>
  );
};

// Map Redux State to props!
function mapStateToProps(state) {
  return {
    auth: state.AuthReducer,
  };
}
// Dispatching Functions from the AuthActions file
const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (userData) => {
      dispatch(loginUser(userData));
    },
    logoutUser: () => dispatch(logoutUser()),
  };
};

// Connect everything here
export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
