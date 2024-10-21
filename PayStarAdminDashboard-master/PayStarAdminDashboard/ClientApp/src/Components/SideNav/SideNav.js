import React from "react";
import { Icon, Menu } from "semantic-ui-react";
import "./SideNav.css";

const SideNav = () => {
  return (
    <Menu vertical large className={"float-btm-left"}>
      <Menu.Item
        name={"hubspot"}
        as={"a"}
        href={"https://app.hubspot.com/activity-feed/"}
        target={"_blank"}
      >
        <Icon name="hubspot" color={"orange"} />
        Hubspot
      </Menu.Item>
      <Menu.Item
        name={"Paystar"}
        as={"a"}
        href={"https://home.paystar.co/"}
        target={"_blank"}
      >
        <Icon name="home" color={"blue"} />
        Paystar Home
      </Menu.Item>
    </Menu>
    /*<div className={"sidenav"}>
      <div className={"button-ctr"}>
        <a href={"https://app.hubspot.com/activity-feed/"} target={"_blank"}>
          <div className={"divButton"}>
            <Icon name={"hubspot"} color={"orange"} />
            HubSpot
          </div>
        </a>
        <a href={"https://home.paystar.co/"} target={"_blank"}>
          <div className={"divButton"}>
            <Icon className={"v2"} name={"home"} />
            PayStar v2
          </div>
        </a>
        <div className={"divButton"}>
          <Icon className={"v1"} name={"home"} />
          PayStar v1
        </div>
      </div>
    </div>*/
  );
};

export default SideNav;
