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
      <a
        onClick={openSearchHandler}
        href="#0"
        className="header-search-icon"
        data-tip="Search"
        data-for="search"
      >
        <i className="fas fa-search"></i>
      </a>{" "}
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
      <span
        className={
          "mr-2 header-chat-icon " +
          (appState.unreadChatCount ? "text-danger" : "text-white")
        }
        data-tip="Chat"
        data-for="chat"
        onClick={() => appDispatch({ type: "toggleChat" })}
      >
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? (
          <span className="chat-count-badge text-white">
            {appState.unreadChatCount < 9 ? appState.unreadChatCount : "9+"}
          </span>
        ) : (
          ""
        )}
      </span>{" "}
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />
      <Link
        to={`/profile/${appState.user.username}`}
        data-tip="My Profile"
        data-for="profile"
      >
        <div className="c-avatar c-avatar--red">
          <span className="c-avatar__firstletter">
            {appState.user.username.slice(0, 1).toUpperCase()}{" "}
          </span>
          <img
            src={appState.user.avatar}
            alt={`Profile picture of ${appState.user.username}`}
          />
        </div>
      </Link>{" "}
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
      <div className="p-header__nav-btns">
        <Link
          to="/create-post"
          className="c-button c-button--inverse c-button--small"
        >
          Create Post
        </Link>{" "}
        <button
          onClick={handleLogOut}
          className="c-button c-button--primary c-button--small"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default HeaderLoggedIn;
