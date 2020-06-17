import React, { useState, useContext, useEffect } from "react";

import Axios from "axios";

import DispatchContext from "../DispatchContext";

function Login() {
  const appDispatch = useContext(DispatchContext);

  // Pieces of state
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(e) {
    // 1. Prevent the browser default behavior of submitting a form
    e.preventDefault();

    // 2. Send off a network request to our backend server
    try {
      const response = await Axios.post("/login", {
        username,
        password,
      });
      if (response.data) {
        appDispatch({ type: "login", data: response.data });
        appDispatch({
          type: "flashMessage",
          value: "You have successfully logged in!",
        });
      } else {
        appDispatch({
          type: "flashMessage",
          value: "Invalid username or password.",
        });
      }
    } catch (e) {
      console.log("There was a problem.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="o-form">
      <div className="o-form__group">
        <label htmlFor="username-login">
          <small>Username</small>
        </label>
        <input
          id="username-login"
          onChange={(e) => setUsername(e.target.value)}
          name="username"
          type="text"
          placeholder="Username"
          autoComplete="off"
        />
      </div>
      <div className="o-form__group">
        <label htmlFor="password-login">
          <small>Password</small>
        </label>
        <input
          id="password-login"
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          type="password"
          placeholder="Password"
        />
      </div>
      <button
        type="submit"
        className="c-button c-button--primary c-button--shadow c-button--100% c-button--large u-pv-2 u-mt-1 u-ls-p02"
      >
        Sign in to Writescape
      </button>
    </form>
  );
}

export default Login;
