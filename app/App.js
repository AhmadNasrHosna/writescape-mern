import React, { useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";

// Set a default/base url for all Axios requests
Axios.defaults.baseURL =
  process.env.BACKENDURL || "https://writescape-api.herokuapp.com";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// App components
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import About from "./components/About";
import Terms from "./components/Terms";
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const SinglePost = React.lazy(() => import("./components/SinglePost"));
import EditPost from "./components/EditPost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));
import LoadingIcon from "./components/LoadingIcon";

function App() {
  const baseState = {
    loggedIn: Boolean(localStorage.getItem("writescapeLoggedInUser")),
    user: JSON.parse(localStorage.getItem("writescapeLoggedInUser")) || {},
    flashMessages: [],
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
      case "openSearch":
        draft.isSearchOpen = true;
        return;
      case "closeSearch":
        draft.isSearchOpen = false;
        return;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "closeChat":
        draft.isChatOpen = false;
        return;
      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        return;
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
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

      // Close the chat on logging out if it was opened
      if (state.isChatOpen) {
        dispatch({ type: "closeChat" });
      }
    }
  }, [state.loggedIn]);

  // Check if token has expired or not on first rendered
  useEffect(() => {
    if (state.loggedIn) {
      const request = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/checkToken",
            { token: state.user.token },
            { cancelToken: request.token }
          );
          // if the server send back false
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessage",
              value: "Your session has expired. You need to log in again.",
            });
          }
        } catch (err) {
          console.log("There was a problem or the request was canceled.");
        }
      }
      fetchResults();
      return () => request.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <div className="o-page">
            <FlashMessages messages={state.flashMessages} />
            <Header />
            <Suspense fallback={<LoadingIcon />}>
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
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Suspense>
            <CSSTransition
              timeout={300}
              in={state.isSearchOpen}
              classNames="search-overlay"
              unmountOnExit
            >
              <div className="search-overlay">
                <Suspense fallback="">
                  <Search />
                </Suspense>
              </div>
            </CSSTransition>
            <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
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
