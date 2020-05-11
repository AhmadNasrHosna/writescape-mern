import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";

// Set a default/base url for all Axios requests
Axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// App components
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import About from "./components/About";
import Terms from "./components/Terms";
import CreatePost from "./components/CreatePost";
import SinglePost from "./components/SinglePost";
import EditPost from "./components/EditPost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";

function App() {
  const baseState = {
    loggedIn: Boolean(localStorage.getItem("writescapeLoggedInUser")),
    user: JSON.parse(localStorage.getItem("writescapeLoggedInUser")),
    flashMessages: [],
  };

  function reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        draft.flashMessages.push("You successfully logged in!");
        return;
      case "logout":
        draft.loggedIn = false;
        draft.flashMessages.push("You logged out!");
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, baseState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem(
        "writescapeLoggedInUser",
        JSON.stringify(state.user)
      );
    } else {
      localStorage.removeItem("writescapeLoggedInUser");
    }
  }, [state.loggedIn]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <div className="o-page">
            <FlashMessages messages={state.flashMessages} />
            <Header />
            <Switch>
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/terms">
                <Terms />
              </Route>
              <Route path="/create-post">
                <CreatePost />
              </Route>
              <Route path="/post/:id" exact>
                <SinglePost />
              </Route>
              <Route path="/post/:id/edit" exact>
                <EditPost />
              </Route>
              <Route path="/profile/:username">
                <Profile />
              </Route>
            </Switch>
            <Footer />
          </div>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<App />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
