import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogOut() {
    appDispatch({ type: "logout" });
    appDispatch({
      type: "flashMessage",
      value: "You have successfully logged out!",
    });
  }

  function openSearchHandler(e) {
    // Prevent the browser default behavior of clicking on a link
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  }

  return (
    <div className="p-header__loggedin">
      <button
        onClick={openSearchHandler}
        className="p-header__search"
        data-tip="Search"
        data-for="search"
      ></button>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
      <button
        className={
          "p-header__chat " +
          (appState.unreadChatCount ? "p-header__chat--unread" : "")
        }
        data-tip="Chat"
        data-for="chat"
        onClick={() => appDispatch({ type: "toggleChat" })}
      >
        {appState.unreadChatCount ? (
          <span className="chat-count-badge text-white">
            {appState.unreadChatCount < 9 ? appState.unreadChatCount : "9+"}
          </span>
        ) : (
          ""
        )}
      </button>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />
      <Link
        to={`/profile/${appState.user.username}`}
        data-tip="My Profile"
        data-for="profile"
        className="p-header__profile-pic"
      >
        <div className="c-avatar c-avatar--red">
          <span className="c-avatar__firstletter">
            {appState.user.username.slice(0, 1).toUpperCase()}
          </span>
          <img
            src={appState.user.avatar}
            alt={`Profile picture of ${appState.user.username}`}
          />
        </div>
      </Link>{" "}
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
      <div className="p-header__nav-btns">
        <ul className="o-list o-list--inline">
          <li>
            <Link
              to="/create-post"
              className="c-button c-button--inverse c-button--small c-button--100%"
            >
              Create Post
            </Link>{" "}
          </li>
          <li>
            <button
              onClick={handleLogOut}
              className="c-button c-button--primary c-button--small c-button--100%"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HeaderLoggedIn;
