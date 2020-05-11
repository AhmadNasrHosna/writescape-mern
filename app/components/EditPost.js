import React, { useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import Page from "./Page";
import Container from "./Container";
import LoadingIcon from "./LoadingIcon";

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

        dispatch({
          type: "fetchComplete",
          value: response.data,
        });
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
    <Page title={`Edit post: ${title.value}`}>
      <Container>
        <Link to={`/post/${id}`} className="small font-weight-bold">
          <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
            <path
              id="arrow-left"
              d="M3.919,243.077c-0.223,0.33-0.414,0.675-0.618,1.015c-0.186,0.31-0.382,0.614-0.552,0.936  c-0.186,0.349-0.346,0.709-0.514,1.066c-0.157,0.332-0.321,0.658-0.464,0.998c-0.144,0.349-0.261,0.706-0.388,1.06  c-0.129,0.362-0.268,0.718-0.38,1.089c-0.107,0.358-0.188,0.721-0.279,1.085c-0.093,0.374-0.199,0.743-0.275,1.125  c-0.084,0.422-0.133,0.849-0.194,1.275c-0.047,0.326-0.109,0.645-0.143,0.976c-0.15,1.53-0.15,3.07,0,4.6  c0.034,0.33,0.096,0.65,0.143,0.976c0.061,0.425,0.11,0.853,0.194,1.275c0.076,0.382,0.18,0.749,0.275,1.125  c0.092,0.362,0.171,0.726,0.279,1.085c0.112,0.369,0.251,0.726,0.38,1.089c0.127,0.354,0.244,0.711,0.388,1.06  c0.143,0.34,0.307,0.666,0.464,0.998c0.168,0.355,0.327,0.715,0.514,1.064c0.171,0.321,0.366,0.625,0.552,0.936  c0.203,0.34,0.394,0.684,0.618,1.015c0.234,0.351,0.493,0.68,0.745,1.015c0.205,0.272,0.393,0.549,0.608,0.813  c0.489,0.596,1.002,1.168,1.548,1.711l116.36,116.36c4.544,4.544,10.501,6.817,16.455,6.817c5.956,0,11.913-2.271,16.455-6.817  c9.089-9.089,9.089-23.824,0-32.912l-76.636-76.636h409.272c12.853,0,23.273-10.42,23.273-23.273  c0-12.853-10.42-23.273-23.273-23.273H79.456l76.636-76.636c9.089-9.089,9.089-23.824,0-32.912c-9.087-9.089-23.824-9.089-32.912,0  L6.82,239.538c-0.546,0.543-1.06,1.116-1.548,1.711c-0.216,0.264-0.403,0.541-0.608,0.813  C4.412,242.397,4.153,242.726,3.919,243.077z"
            ></path>
          </svg>{" "}
          Back to post permalink
        </Link>
        <form onSubmit={submitHandler} className="mt-3">
          <div className="form-group">
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
              className="form-control form-control-lg form-control-title"
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
          <div className="form-group">
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
            className="btn btn-primary"
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
      </Container>
    </Page>
  );
}

export default EditPost;
