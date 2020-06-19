import React from "react";
import { NavLink } from "react-router-dom";

function HeaderLoggedOut() {
  return (
    <div className="p-header__loggedout">
      <div className="p-header__btns">
        <ul className="o-list o-list--inline">
          <li>
            <NavLink exact to="/login">
              <button className="c-button c-button--inverse c-button--medium c-button--100%">
                Login
              </button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/register">
              <button className="c-button c-button--primary c-button--medium c-button--100%">
                Sign up
              </button>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HeaderLoggedOut;
