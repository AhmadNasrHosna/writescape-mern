import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggedIn from "./HeaderLoggedIn";
import StateContext from "../StateContext";

function Header({ staticEmpty }) {
  const appState = useContext(StateContext);
  const headerContent = appState.loggedIn ? (
    <HeaderLoggedIn />
  ) : (
    <HeaderLoggedOut />
  );

  return (
    <header className="p-header">
      <div className="o-container">
        <div className="p-header__inner">
          <h1 className="p-header__logo">
            <Link to="/">Writescape</Link>
          </h1>
          {!staticEmpty ? headerContent : ""}
        </div>
      </div>
    </header>
  );
}

export default Header;
