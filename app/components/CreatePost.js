import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import Page from "./Page";
import Container from "./Container";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function CreatePost() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const [postId, setPostId] = useState(false);

  async function handleSubmit(e) {
    // 1. Prevent the browser default behavior of submitting a form
    e.preventDefault();

    // 2. Send off a network request to our backend server
    try {
      const response = await Axios.post("/create-post", {
        title,
        body,
        token: appState.user.token,
      });
      // 3. Change piece of state postId to the ID string of the returned response from the server
      if (response.data) {
        setPostId(response.data);
      }
    } catch (err) {
      console.log("There was a problem!");
    }
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
            <h2 class="o-section__title o-section__title--md">
              Create new post
            </h2>
            <form class="o-form o-form--accent" onSubmit={handleSubmit}>
              <div className="o-form__group">
                <label htmlFor="post-title">
                  <small>Title</small>
                </label>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                  name="title"
                  id="post-title"
                  className="o-form__title"
                  type="text"
                  placeholder=""
                  autoComplete="off"
                />
              </div>

              <div className="o-form__group">
                <label htmlFor="post-body">
                  <small>Body Content</small>
                </label>
                <textarea
                  onChange={(e) => setBody(e.target.value)}
                  name="body"
                  id="post-body"
                  className="body-content tall-textarea form-control"
                  type="text"
                ></textarea>
              </div>

              <button className="c-button c-button--medium c-button--accent">
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
