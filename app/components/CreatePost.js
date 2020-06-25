import React, { useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";

import { CSSTransition } from "react-transition-group";

import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

import Page from "./Page";
import Container from "./Container";

function CreatePost() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const baseState = {
    title: {
      value: "",
      hasErrors: false,
      message: "",
    },
    body: {
      value: "",
      hasErrors: false,
      message: "",
    },
    postId: false,
    sendCount: 0,
    isPosting: false,
  };

  function reducer(draft, { type, value }) {
    switch (type) {
      case "titleChange":
        draft.title.value = value;
        return;
      case "bodyChange":
        draft.body.value = value;
        return;
      case "titleRules":
        if (!value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = "You must provide a title.";
        } else {
          draft.title.hasErrors = false;
        }
        return;
      case "bodyRules":
        if (!value.trim()) {
          draft.body.hasErrors = true;
          draft.body.message = "You must provide body content.";
        } else {
          draft.body.hasErrors = false;
        }
        return;
      case "submitRequest":
        // If there are no errors
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
          draft.isPosting = true;
        }
        return;
      case "postId":
        draft.postId = value;
        return;
    }
  }

  const [
    { title, body, postId, sendCount, isPosting },
    dispatch,
  ] = useImmerReducer(reducer, baseState);

  useEffect(() => {
    // If sendCount greater than 0 send our request
    if (sendCount) {
      const request = Axios.CancelToken.source();

      async function createPost() {
        // 2. Send off a network request to our backend server
        try {
          const response = await Axios.post("/create-post", {
            title: title.value,
            body: body.value,
            token: appState.user.token,
          });
          // 3. Change the piece of state postId to the ID string of the returned response from the server
          if (response.data) {
            dispatch({
              type: "postId",
              value: response.data,
            });
          }
        } catch (err) {
          console.log("There was a problem!");
        }
      }

      createPost();
      return () => request.cancel();
    }
  }, [sendCount]);

  function handleSubmit(e) {
    // 1. Prevent the browser default behavior of submitting a form
    e.preventDefault();

    // Check post title rules
    dispatch({
      type: "titleRules",
      value: title.value,
    });

    // Check post body rules
    dispatch({
      type: "bodyRules",
      value: body.value,
    });

    // Submit a request
    dispatch({ type: "submitRequest" });
  }

  if (postId) {
    // Success message
    appDispatch({
      type: "flashMessage",
      value: "Congrats, post was successfully created!",
    });

    // Redirecting to the newly created post.
    return <Redirect to={`/post/${postId}`} />;
  }

  return (
    <Page title="Create New Post" scope="createpost">
      <section className="o-section o-section--createpost">
        <Container>
          <div className="o-section__inner u-flow">
            <h2 className="o-section__title o-section__title--md">
              Create new post
            </h2>
            <form className="o-form o-form--accent" onSubmit={handleSubmit}>
              <div className="o-form__group">
                <label htmlFor="post-title">
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
                <CSSTransition
                  timeout={300}
                  in={title.hasErrors}
                  classNames="c-validate"
                  unmountOnExit
                >
                  <div className="c-validate">{title.message}</div>
                </CSSTransition>
              </div>

              <div className="o-form__group">
                <label htmlFor="post-body">
                  <small>Body Content</small>
                </label>
                <textarea
                  onChange={(e) => {
                    dispatch({ type: "bodyChange", value: e.target.value });
                    dispatch({ type: "bodyRules", value: e.target.value });
                  }}
                  name="body"
                  id="post-body"
                  className="o-form__textarea--tall"
                  type="text"
                ></textarea>
                <CSSTransition
                  timeout={300}
                  in={body.hasErrors}
                  classNames="c-validate"
                  unmountOnExit
                >
                  <div className="c-validate">{body.message}</div>
                </CSSTransition>
              </div>

              <button
                disabled={isPosting}
                className="c-button c-button--medium c-button--accent"
              >
                Publish
              </button>
            </form>
          </div>
        </Container>
      </section>
    </Page>
  );
}

export default CreatePost;
