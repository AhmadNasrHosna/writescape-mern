import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
import { useParams } from "react-router-dom";

import StateContext from "../StateContext";

function ProfileFollow({ urlPath, followerCount, followingCount }) {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  // Send off a network request to our backend server
  useEffect(() => {
    setIsLoading(true); // Refresh to the base value on re-rendering
    const request = Axios.CancelToken.source();
    async function fetchFollow() {
      try {
        const response = await Axios.get(`/profile/${username}${urlPath}`, {
          cancelToken: request.token,
        });
        setList(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }
    fetchFollow();
    return () => request.cancel();
  }, [username, followerCount, urlPath]);

  if (isLoading) return <LoadingIcon />;

  function isVisitorOwner() {
    if (!appState.loggedIn) return;
    // Now user logged in!
    return appState.user.username == username;
  }

  function handleEmptyFollowingList() {
    // If the list empty
    if (!followingCount && !list.length) {
      if (isVisitorOwner()) {
        return <p>You aren&rsquo;t following anyone yet.</p>;
      } else {
        return <p>{username} isn&rsquo;t following anyone yet.</p>;
      }
    }
  }

  function handleEmptyFollowersList() {
    // If the list empty
    if (!followerCount && !list.length) {
      if (isVisitorOwner()) {
        return <p>You don&rsquo;t have any followers yet.</p>;
      } else {
        return (
          <p>
            {username} doesn&rsquo;t have any followers yet.
            {appState.loggedIn ? (
              " Be the first to follow him!"
            ) : (
              <>
                If you want to follow him you need to{" "}
                <Link to="/">sign up</Link> for an account first.
              </>
            )}
          </p>
        );
      }
    }
  }

  return (
    <div className="list-group">
      {list.map(({ username, avatar }, index) => {
        return (
          <Link
            to={`/profile/${username}`}
            key={index}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={avatar} />
            {username}
          </Link>
        );
      })}
      {urlPath == "/followers" && handleEmptyFollowersList()}
      {urlPath == "/following" && handleEmptyFollowingList()}
    </div>
  );
}

export default ProfileFollow;
