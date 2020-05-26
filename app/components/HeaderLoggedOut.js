import React from "react";
import { NavLink } from "react-router-dom";

function HeaderLoggedOut() {
  return (
    <nav className="p-header__nav">
      <ul className="o-list o-list--inline">
        <li>
          <NavLink exact to="/login">
            <button className="c-button c-button--inverse c-button--medium">
              Login
            </button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/register">
            <button className="c-button c-button--primary c-button--medium">
              Sign up
            </button>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default HeaderLoggedOut;
