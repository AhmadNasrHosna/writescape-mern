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
        return (
          <div className="c-profile__emptylist-message">
            <p>You aren&rsquo;t following anyone yet.</p>
          </div>
        );
      } else {
        return (
          <div className="c-profile__emptylist-message">
            <p>{username} isn&rsquo;t following anyone yet.</p>
          </div>
        );
      }
    }
  }

  function handleEmptyFollowersList() {
    // If the list empty
    if (!followerCount && !list.length) {
      if (isVisitorOwner()) {
        return (
          <div className="c-profile__emptylist-message">
            <p>You don&rsquo;t have any followers yet.</p>
          </div>
        );
      } else {
        return (
          <div className="c-profile__emptylist-message">
            <p>
              {username} doesn&rsquo;t have any followers yet.{" "}
              {appState.loggedIn ? (
                "Be the first to follow him!"
              ) : (
                <>
                  If you want to follow him you need to{" "}
                  <Link to="/">sign up</Link> for an account first.
                </>
              )}
            </p>
          </div>
        );
      }
    }
  }

  return (
    <>
      {!!list.length && (
        <ul className="o-list c-profile__follow">
          {list.map(({ username, avatar }, index) => {
            return (
              <li key={index}>
                <Link
                  to={`/profile/${username}`}
                  className="c-profile__follow-item"
                >
                  <div className="c-avatar c-avatar--red">
                    <span className="c-avatar__firstletter">
                      {username.slice(0, 1).toUpperCase()}
                    </span>
                    <img src={avatar} alt={`Profile picture of ${username}`} />
                  </div>
                  <span>{username}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {urlPath == "/followers" && handleEmptyFollowersList()}
      {urlPath == "/following" && handleEmptyFollowingList()}
    </>
  );
}

export default ProfileFollow;
