import React, { useEffect, useContext } from "react";

import { useImmerReducer } from "use-immer";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";

import DispatchContext from "../DispatchContext";

function Register() {
  const appDispatch = useContext(DispatchContext);
  const baseState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErrors: false,
      message: "",
    },
    submitCount: 0,
  };

  function reducer(draft, { type, value, noRequest }) {
    switch (type) {
      case "usernameImmediately":
        draft.username.hasErrors = false;
        draft.username.value = value;
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message = "Username can not exceed 30 characters.";
        }
        if (
          draft.username.value &&
          !/^([a-zA-Z0-9+]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErrors = true;
          draft.username.message =
            "Username can only contain letters and numbers.";
        }
        return;
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message = "Username must be at least 3 characters.";
        }
        if (!draft.username.hasErrors && !noRequest) {
          draft.username.checkCount++;
        }
        return;
      case "usernameUniqueResults":
        if (value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = "That username is already taken!";
        } else {
          draft.username.isUnique = true;
        }
        return;
      case "emailImmediately":
        draft.email.hasErrors = false;
        draft.email.value = value;
        return;
      case "emailAfterDelay":
        if (!/^\S+@\S+\.\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = "You must provide a valid email address.";
        }
        if (!draft.email.hasErrors && !noRequest) {
          draft.email.checkCount++;
        }
        return;
      case "emailUniqueResults":
        if (value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = "That email is already being used!";
        } else {
          draft.email.isUnique = true;
        }
        return;
      case "passwordImmediately":
        draft.password.hasErrors = false;
        draft.password.value = value;
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message = "Password can not exceed 50 characters.";
        }
        return;
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true;
          draft.password.message = "Password must be at least 12 characters.";
        }
        return;
      case "submitForm":
        if (
          !draft.username.hasErrors &&
          draft.username.isUnique &&
          !draft.email.hasErrors &&
          draft.email.isUnique &&
          !draft.password.hasErrors
        ) {
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, baseState);

  useEffect(() => {
    if (state.username.value) {
      // if username value not empty
      const timer = setTimeout(
        () => dispatch({ type: "usernameAfterDelay" }),
        800
      );
      return () => clearTimeout(timer);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      // if email value not empty
      const timer = setTimeout(
        () => dispatch({ type: "emailAfterDelay" }),
        800
      );
      return () => clearTimeout(timer);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      // if password value not empty
      const timer = setTimeout(
        () => dispatch({ type: "passwordAfterDelay" }),
        800
      );
      return () => clearTimeout(timer);
    }
  }, [state.password.value]);

  // Send off a network request to our backend server
  useEffect(() => {
    // If username.checkCount greater than 0 send our request
    // Only our request will be sent at update not at mount
    if (state.username.checkCount) {
      const request = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/doesUserNameExist",
            { username: state.username.value },
            { cancelToken: request.token }
          );
          dispatch({
            type: "usernameUniqueResults",
            value: response.data,
          });
        } catch (err) {
          console.log("There was a problem or the request was canceled.");
        }
      }
      fetchResults();
      return () => request.cancel();
    }
  }, [state.username.checkCount]);

  // Send off a network request to our backend server
  useEffect(() => {
    // If email.checkCount greater than 0 send our request
    // Only our request will be sent at update not at mount
    if (state.email.checkCount) {
      const request = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/doesEmailExist",
            { email: state.email.value },
            { cancelToken: request.token }
          );
          dispatch({
            type: "emailUniqueResults",
            value: response.data,
          });
        } catch (err) {
          console.log("There was a problem or the request was canceled.");
        }
      }
      fetchResults();
      return () => request.cancel();
    }
  }, [state.email.checkCount]);

  // Send off a network request to our backend server
  // Send registration form data and then login
  useEffect(() => {
    if (state.submitCount) {
      const request = Axios.CancelToken.source();
      async function sendData() {
        try {
          const response = await Axios.post(
            "/register",
            {
              username: state.username.value,
              email: state.email.value,
              password: state.password.value,
            },
            { cancelToken: request.token }
          );
          appDispatch({ type: "login", data: response.data });
          appDispatch({
            type: "flashMessage",
            value: "Congrats! Welcome to your new account.",
          });
        } catch (err) {
          console.log("There was a problem or the request was canceled.");
        }
      }
      sendData();
      return () => request.cancel();
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    // 1. Prevent the browser default behavior of submitting a form
    e.preventDefault();

    // 2. Trigger all the validation rules before we send off a network request to our backend server
    dispatch({ type: "usernameImmediately", value: state.username.value });
    dispatch({
      type: "usernameAfterDelay",
      value: state.username.value,
      noRequest: true,
    });
    dispatch({ type: "emailImmediately", value: state.email.value });
    dispatch({
      type: "emailAfterDelay",
      value: state.email.value,
      noRequest: true,
    });
    dispatch({ type: "passwordImmediately", value: state.password.value });
    dispatch({ type: "passwordAfterDelay", value: state.password.value });
    // Then submit the registration form
    dispatch({ type: "submitForm" });
  }
  return (
    <form onSubmit={handleSubmit} className="o-form">
      <div className="o-form__group">
        <label htmlFor="username-register">
          <small>Username</small>
        </label>
        <input
          id="username-register"
          name="username"
          type="text"
          placeholder="Pick a username"
          autoComplete="off"
          onChange={(e) =>
            dispatch({
              type: "usernameImmediately",
              value: e.target.value,
            })
          }
        />
        <CSSTransition
          in={state.username.hasErrors}
          timeout={330}
          classNames="liveValidateMessage"
          unmountOnExit
        >
          <div className="alert alert-danger small liveValidateMessage">
            {state.username.message}
          </div>
        </CSSTransition>
      </div>
      <div className="o-form__group">
        <label htmlFor="email-register">
          <small>Email</small>
        </label>
        <input
          id="email-register"
          name="email"
          type="text"
          placeholder="you@example.com"
          autoComplete="off"
          onChange={(e) =>
            dispatch({
              type: "emailImmediately",
              value: e.target.value,
            })
          }
        />
        <CSSTransition
          in={state.email.hasErrors}
          timeout={330}
          classNames="liveValidateMessage"
          unmountOnExit
        >
          <div className="alert alert-danger small liveValidateMessage">
            {state.email.message}
          </div>
        </CSSTransition>
      </div>
      <div className="o-form__group">
        <label htmlFor="password-register">
          <small>Password</small>
        </label>
        <input
          id="password-register"
          name="password"
          type="password"
          placeholder="Create a password"
          onChange={(e) =>
            dispatch({
              type: "passwordImmediately",
              value: e.target.value,
            })
          }
        />
        <CSSTransition
          in={state.password.hasErrors}
          timeout={330}
          classNames="liveValidateMessage"
          unmountOnExit
        >
          <div className="alert alert-danger small liveValidateMessage">
            {state.password.message}
          </div>
        </CSSTransition>
      </div>
      <button
        type="submit"
        className="c-button c-button--primary c-button--shadow c-button--100% c-button--large u-pv-2 u-mt-1 u-ls-p02"
      >
        Sign up for Writescape
      </button>
    </form>
  );
}

export default Register;
