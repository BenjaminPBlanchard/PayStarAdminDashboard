import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import "./HomePage.css";

function HomePage() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div style={{ marginLeft: "205px", marginTop: "5px", marginRight: "5px" }}>
      <Menu tabular fluid widths={5}>
        <Menu.Item
          className={"tab"}
          name={"Dashboard"}
          active={activeItem === "Dashboard"}
        />
        <Menu.Item
          className={"tab"}
          name={"Clients"}
          active={activeItem === "Clients"}
        />
        <Menu.Item
          className={"tab"}
          name={"Sales Reps"}
          active={activeItem === "Sales Reps"}
        />
        <Menu.Item
          className={"tab"}
          name={"Jobs"}
          active={activeItem === "Jobs"}
        />
        <Menu.Item
          className={"tab"}
          name={"Reports"}
          active={activeItem === "Reports"}
        />
      </Menu>
    </div>
  );
}

export default HomePage;
