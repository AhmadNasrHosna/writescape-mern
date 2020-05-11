import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import LoadingIcon from "./LoadingIcon";

function ProfilePosts({ username }) {
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
        setPosts(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }

    fetchPosts();

    return () => request.cancel();
  }, []);

  if (isLoading) return <LoadingIcon />;

  return (
    <div className="list-group">
      {posts.map(({ title, createdDate, _id, author }, index) => {
        const date = new Date(createdDate);
        const dateFormatted = `
          ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}
        `;
        return (
          <Link
            to={`/post/${_id}`}
            key={index}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={author.avatar} />
            <strong>{title}</strong>{" "}
            <span className="text-muted small">on {dateFormatted}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default ProfilePosts;
