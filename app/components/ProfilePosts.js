import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";
import { useParams } from "react-router-dom";

import StateContext from "../StateContext";

import PostCard from "./PostCard";

function ProfilePosts() {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  // Send off a network request to our backend server
  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
          cancelToken: request.token,
        });
        if (response.data) {
          setPosts(response.data);
          setIsLoading(false);
        }
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }

    fetchPosts();

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
    if (!posts.length) {
      if (isVisitorOwner()) {
        return (
          <div className="c-profile__emptylist-message">
            <p>
              You haven&rsquo;t created any posts yet;{" "}
              <Link to="/create-post">create one now!</Link>
            </p>
          </div>
        );
      } else {
        return (
          <div className="c-profile__emptylist-message">
            <p>{username} hasn&rsquo;t created any posts yet.</p>
          </div>
        );
      }
    }
  }

  return (
    <>
      <ul className="o-list c-profile__posts">
        {posts.map((post) => {
          return (
            <PostCard
              post={post}
              key={post._id}
              isAuthorHidden={true}
              className="c-post-card--profile"
            />
          );
        })}
      </ul>
      {handleEmptyList()}
    </>
  );
}

export default ProfilePosts;
