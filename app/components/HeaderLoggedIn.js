import React, { useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import ReactTooltip from "react-tooltip";

function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogOut() {
    appDispatch({ type: "logout" });
  }

  function openSearchHandler(e) {
    // Prevent the browser default behavior of clicking on a link
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <a
        onClick={openSearchHandler}
        href="#0"
        className="text-white mr-2 header-search-icon"
        data-tip="Search"
        data-for="search"
      >
        <i className="fas fa-search"></i>
      </a>{" "}
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
      <span
        className="mr-2 header-chat-icon text-white"
        data-tip="Chat"
        data-for="chat"
      >
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>{" "}
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />
      <Link
        to={`/profile/${appState.user.username}`}
        className="mr-2"
        data-tip="My Profile"
        data-for="profile"
      >
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>{" "}
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
      <Link to="/create-post" className="btn btn-sm btn-success mr-2">
        Create Post
      </Link>{" "}
      <button onClick={handleLogOut} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
