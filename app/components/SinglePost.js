import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import Axios from "axios";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import Container from "./Container";
import LoadingIcon from "./LoadingIcon";
import NotFound from "./NotFound";
import FloatingShareIcons from "./FloatingShareIcons";
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

  const date = new Date(post.createdDate).toDateString().split(" ");
  const { dayName, day, month, year } = {
    dayName: date[0],
    day: date[2],
    month: date[1],
    year: date[3],
  };
  const dateFormatted = `${dayName}, ${month} ${day}, ${year}`;

  function isVisitorOwner() {
    if (!appState.loggedIn) return;
    return appState.user.username == post.author.username;
  }

  return (
    <Page title={post.title}>
      <article className="c-article">
        <header className="c-article__header">
          <Container wide={true}>
            <h2 className="c-article__title">{post.title}</h2>
            {isVisitorOwner() && (
              <div className="c-article__actions">
                <Link to={`/post/${id}/edit`} data-tip="Edit" data-for="edit">
                  <i className="fas fa-edit"></i>
                </Link>{" "}
                <ReactTooltip id="edit" className="custom-tooltip" />
                <a
                  onClick={deleteHandler}
                  href="#delete"
                  data-tip="Delete"
                  data-for="delete"
                >
                  <i className="fas fa-trash"></i>
                </a>
                <ReactTooltip id="delete" className="custom-tooltip" />
              </div>
            )}
            <div className="c-article__meta u-mv-auto">
              <Link to={`/profile/${post.author.username}`}>
                <div className="c-article__author">
                  <div className="c-avatar c-avatar--dark u-inline-block">
                    <span className="c-avatar__firstletter">
                      {post.author.username.slice(0, 1).toUpperCase()}{" "}
                    </span>
                    <img
                      src={post.author.avatar}
                      alt={`Profile picture of ${post.author.username}`}
                    />
                  </div>
                  <span>{post.author.username}</span>
                </div>
              </Link>
              <div className="c-article__date">
                <time>{dateFormatted}</time>
              </div>
            </div>
          </Container>
        </header>
        <section className="o-section">
          <Container>
            <div className="c-article__body u-flow">
              <FloatingShareIcons title={post.title} />
              <ReactMarkDown source={post.body} />
            </div>
          </Container>
        </section>
      </article>
    </Page>
  );
}

export default SinglePost;
