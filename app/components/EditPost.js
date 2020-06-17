import React, { useEffect, useContext } from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import Container from "./Container";
import LoadingIcon from "./LoadingIcon";
import NotFound from "./NotFound";

function EditPost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const baseState = {
    title: {
      prevSavedValue: "",
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      prevSavedValue: "",
      value: "",
      hasErrors: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
    permissionProblem: false,
    statusMessages: {
      isUpdated: "Post is up to date!",
      hasErrors: "There is an error above!",
      hasChanges: "There are new changes, save it now!",
      isSaving: "Please wait until we save you changes...",
    },
    status: "Post is up to date!",
  };

  function reducer(draft, { type, value }) {
    switch (type) {
      case "fetchComplete":
        draft.title.value = value.title;
        draft.body.value = value.body;
        draft.title.prevSavedValue = value.title;
        draft.body.prevSavedValue = value.body;
        draft.isFetching = false;

        if (appState.loggedIn) {
          if (appState.user.username != value.author.username) {
            draft.permissionProblem = true;
          }
        } else {
          draft.permissionProblem = true;
        }
        return;
      case "titleChange":
        if (value != draft.title.prevSavedValue) {
          // 1. Value was changed

          // 2.1 Body has errors, status will not be changed
          if (!draft.body.hasErrors) {
            // 2.2 body has no errors and we are here, then change status
            draft.status = draft.statusMessages.hasChanges;
          }
        } else {
          // 1. Value was unchanged

          // 2.1 Body has errors, status will not be changed

          if (!draft.body.hasErrors) {
            // 2.2 body has no errors and we are here, then change status
            draft.status = draft.statusMessages.isUpdated;
          }
        }
        draft.title.value = value;
        return;
      case "bodyChange":
        if (value != draft.body.prevSavedValue) {
          // 1. Value was changed

          // 2.1 Title has errors, status will not be changed
          if (!draft.title.hasErrors) {
            // 2.2 Title has no errors and we are here, then change status
            draft.status = draft.statusMessages.hasChanges;
          }
        } else {
          // 1. Value was unchanged

          // 2.1 Title has errors, status will not be changed
          if (!draft.title.hasErrors) {
            // 2.2 Title has no errors and we are here, then change status
            draft.status = draft.statusMessages.isUpdated;
          }
        }
        draft.body.value = value;
        return;
      case "submitRequest":
        // If there are no errors
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }
        return;
      case "saveRequestStarted":
        draft.isSaving = true;
        draft.status = draft.statusMessages.isSaving;
        return;
      case "saveRequestFinished":
        draft.isSaving = false;
        draft.status = draft.statusMessages.isUpdated;
        draft.title.prevSavedValue = value.updatedTitleValue;
        draft.body.prevSavedValue = value.updatedBodyValue;
        return;
      case "titleRules":
        if (!value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title.";
          draft.status = draft.statusMessages.hasErrors;
        } else {
          draft.title.hasErrors = false;
        }
        return;
      case "bodyRules":
        if (!value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must provide body content.";
          draft.status = draft.statusMessages.hasErrors;
        } else {
          draft.body.hasErrors = false;
        }
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  }

  const [
    {
      title,
      body,
      isFetching,
      isSaving,
      id,
      sendCount,
      notFound,
      permissionProblem,
      status,
      statusMessages,
    },
    dispatch,
  ] = useImmerReducer(reducer, baseState);

  function submitHandler(e) {
    // Prevent the browser default behavior of submitting a form
    e.preventDefault();

    // Check post title rules
    dispatch({ type: "titleRules", value: title.value });

    // Check post body rules
    dispatch({ type: "bodyRules", value: body.value });

    // Submit a request
    dispatch({ type: "submitRequest" });
  }

  // 1. Send off a network request to our backend server
  // for loading the existed title & body value in the current post.
  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: request.token,
        });
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data });
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }

    fetchPost();

    return () => request.cancel();
  }, []);

  // 2. Send off a network request to our backend server
  // for saving the updates
  useEffect(() => {
    // If sendCount greater than 0 send our request
    if (sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const request = Axios.CancelToken.source();

      async function updatePost() {
        try {
          await Axios.post(
            `/post/${id}/edit`,
            {
              title: title.value,
              body: body.value,
              token: appState.user.token,
            },
            { cancelToken: request.token }
          );

          dispatch({
            type: "saveRequestFinished",
            value: {
              updatedTitleValue: title.value,
              updatedBodyValue: body.value,
            },
          });
          appDispatch({
            type: "flashMessage",
            value: "Post successfully updated!",
          });
        } catch (err) {
          console.log("There was a problem or the request was canceled.");
        }
      }

      updatePost();

      return () => request.cancel();
    }
  }, [sendCount]);

  if (notFound) {
    return <NotFound />;
  }

  if (permissionProblem) {
    appDispatch({
      type: "flashMessage",
      value: "You do not have permission to edit that post!",
    });
    return <Redirect to="/" />;
  }

  if (isFetching) {
    return (
      <Page title="...">
        <Container>
          <LoadingIcon />
        </Container>
      </Page>
    );
  }

  return (
    <Page title={`Edit post: ${title.value}`} scope="editpost">
      <section className="o-section o-section--editpost">
        <Container>
          <div className="o-section__inner u-flow">
            <Link to={`/post/${id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="20"
                x="0"
                y="0"
                fill="#2c2221"
                viewBox="18 17 65 65"
                className="u-va-middle"
              >
                <path
                  style={{
                    WebkitTextIndent: "0",
                    textIndent: "0",
                    WebkitTextAlign: "start",
                    textAlign: "start",
                    lineHeight: "normal",
                    WebkitTextTransform: "none",
                    textTransform: "none",
                    blockProgression: "tb",
                    marker: "none",
                    InkscapeFontSpecification: "Sans",
                  }}
                  d="M31.844 978.33a2 2 0 00-1.188.532l-24 22a2 2 0 000 2.969l24 22a2.002 2.002 0 102.688-2.969l-20.188-18.5H92c1.057.015 2.031-.943 2.031-2s-.974-2.015-2.031-2H13.156l20.188-18.531a2 2 0 00-1.5-3.5z"
                  enableBackground="accumulate"
                  fontFamily="Sans"
                  overflow="visible"
                  transform="translate(0 -952.362)"
                ></path>
              </svg>{" "}
              Back to post permalink
            </Link>
            <form onSubmit={submitHandler} className="o-form o-form--accent">
              <div className="o-form__group">
                <label htmlFor="post-title" className="text-muted mb-1">
                  <small>Title</small>
                </label>
                <input
                  value={title.value}
                  onChange={(e) => {
                    dispatch({ type: "titleChange", value: e.target.value });
                    dispatch({ type: "titleRules", value: e.target.value });
                  }}
                  autoFocus
                  name="title"
                  id="post-title"
                  className="o-form__title"
                  type="text"
                  placeholder=""
                  autoComplete="off"
                />
                {title.hasErrors && (
                  <div className="alert alert-danger small liveValidateMessage">
                    {title.message}
                  </div>
                )}
              </div>
              <div className="o-form__group">
                <label htmlFor="post-body" className="text-muted mb-1 d-block">
                  <small>Body Content</small>
                </label>
                <textarea
                  value={body.value}
                  onChange={(e) => {
                    dispatch({ type: "bodyChange", value: e.target.value });
                    dispatch({ type: "bodyRules", value: e.target.value });
                  }}
                  name="body"
                  id="post-body"
                  className="body-content tall-textarea form-control"
                  type="text"
                />
                {body.hasErrors && (
                  <div className="alert alert-danger small liveValidateMessage">
                    {body.message}
                  </div>
                )}
              </div>
              <button
                className="c-button c-button--medium c-button--accent"
                disabled={
                  isSaving ||
                  status == statusMessages.isUpdated ||
                  status == statusMessages.hasErrors
                }
              >
                Save Updates
              </button>{" "}
              <small>{status}</small>
            </form>
          </div>
        </Container>
      </section>
    </Page>
  );
}

export default EditPost;
