import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
import { useParams } from "react-router-dom";

import StateContext from "../StateContext";

function ProfileFollowing() {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [following, setFollowing] = useState([]);

  // Send off a network request to our backend server
  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchFollowing() {
      try {
        const response = await Axios.get(`/profile/${username}/following`, {
          cancelToken: request.token,
        });
        console.log(response.data);
        setFollowing(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }

    fetchFollowing();

    return () => request.cancel();
  }, [username]);

  if (isLoading) return <LoadingIcon />;

  function isVisitorOwner() {
    if (!appState.loggedIn) return;
    // Now user logged in!
    return appState.user.username == username;
  }

  function handleEmptyList() {
    // If the list empty
    if (!following.length) {
      if (isVisitorOwner()) {
        return <p>You aren&rsquo;t following anyone yet.</p>;
      } else {
        return <p>{username} isn&rsquo;t following anyone yet.</p>;
      }
    }
  }

  return (
    <div className="list-group">
      {following.map(({ username, avatar }, index) => {
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

export default ProfileFollowing;
