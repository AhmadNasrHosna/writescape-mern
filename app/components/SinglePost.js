import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";

import Page from "./Page";
import Container from "./Container";
import LoadingIcon from "./LoadingIcon";
import ReactMarkDown from "react-markdown";
import ReactTooltip from "react-tooltip";

function SinglePost() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  // Send off a network request to our backend server
  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: request.token,
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }

    fetchPost();

    return () => request.cancel();
  }, []);

  if (isLoading) {
    return (
      <Page title="...">
        <Container>
          <LoadingIcon />
        </Container>
      </Page>
    );
  }

  const date = new Date(post.createdDate);
  const dateFormatted = `
    ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}
  `;

  return (
    <Page title={post.title}>
      <Container>
        <div className="d-flex justify-content-between">
          <h2>{post.title}</h2>

          <span className="pt-2">
            <Link
              to={`/post/${id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
            >
              <i className="fas fa-edit"></i>
            </Link>{" "}
            <ReactTooltip id="edit" className="custom-tooltip" />
            <a
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
            >
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        </div>

        <p className="text-muted small mb-4">
          <Link to={`/profile/${post.author.username}`}>
            <img className="avatar-tiny" src={post.author.avatar} />
          </Link>
          Posted by{" "}
          <Link to={`/profile/${post.author.username}`}>
            {post.author.username}
          </Link>{" "}
          on {dateFormatted}
        </p>

        <div className="body-content">
          <ReactMarkDown source={post.body} />
        </div>
      </Container>
    </Page>
  );
}

export default SinglePost;
