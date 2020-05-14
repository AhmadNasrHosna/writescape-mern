import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
import { useParams } from "react-router-dom";

import StateContext from "../StateContext";

function ProfileFollowers({ followerCount }) {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);

  // Send off a network request to our backend server
  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchFollowers() {
      try {
        const response = await Axios.get(`/profile/${username}/followers`, {
          cancelToken: request.token,
        });
        console.log(response.data);
        setFollowers(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }

    fetchFollowers();

    return () => request.cancel();
  }, [username, followerCount]);

  if (isLoading) return <LoadingIcon />;

  function isVisitorOwner() {
    if (!appState.loggedIn) return;
    // Now user logged in!
    return appState.user.username == username;
  }

  function handleEmptyList() {
    // If the list empty
    if (!followers.length) {
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
      {followers.map(({ username, avatar }, index) => {
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
      {handleEmptyList()}
    </div>
  );
}

export default ProfileFollowers;
