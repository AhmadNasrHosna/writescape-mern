import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import Axios from "axios";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import Container from "./Container";
import LoadingIcon from "./LoadingIcon";
import NotFound from "./NotFound";
import ReactMarkDown from "react-markdown";
import ReactTooltip from "react-tooltip";

function SinglePost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();
  const [notFound, setNotFound] = useState(false);
  const [deleteAttemptCount, setDeleteAttemptCount] = useState(0);
  const [deleteWasSuccessful, setDeleteWasSuccessful] = useState(false);

  // Send off a network request to our backend server
  // to pull the post data
  useEffect(() => {
    const request = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: request.token,
        });
        if (response.data) {
          setPost(response.data);
          setIsLoading(false);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }
    fetchPost();
    return () => request.cancel();
  }, [id]);

  // Send off a network request to our backend server
  // to delete the post
  useEffect(() => {
    // if the post owner actually confirm that he want to delete the post
    if (deleteAttemptCount) {
      const request = Axios.CancelToken.source();
      async function deletePost() {
        try {
          const response = await Axios.delete(
            `/post/${id}`,
            { data: { token: appState.user.token } },
            { cancelToken: request.token }
          );
          if (response.data == "Success") {
            setDeleteWasSuccessful(true);
          }
        } catch (err) {
          console.log("There was a problem or the request was canceled.");
        }
      }
      deletePost();
      return () => request.cancel();
    }
  }, [deleteAttemptCount]);

  // Delete post handler
  function deleteHandler() {
    // Delete  confirmation
    const confirm = window.confirm(
      "Do you really want to delete this post permanently?"
    );
    if (confirm) setDeleteAttemptCount((prev) => prev + 1);
  }

  if (deleteWasSuccessful) {
    appDispatch({ type: "flashMessage", value: "Post successfully deleted!" });
    return <Redirect to={`/profile/${appState.user.username}`} />;
  }

  if (notFound) {
    return <NotFound />;
  }

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

  function isVisitorOwner() {
    if (!appState.loggedIn) return;
    return appState.user.username == post.author.username;
  }

  return (
    <Page title={post.title}>
      <Container>
        <div className="d-flex justify-content-between">
          <h2>{post.title}</h2>
          {isVisitorOwner() && (
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
                onClick={deleteHandler}
                data-tip="Delete"
                data-for="delete"
                className="delete-post-button text-danger"
              >
                <i className="fas fa-trash"></i>
              </a>
              <ReactTooltip id="delete" className="custom-tooltip" />
            </span>
          )}
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
