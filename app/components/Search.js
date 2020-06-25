import React, { useEffect, useContext } from "react";
import { useImmer } from "use-immer";
import Axios from "axios";

import DispatchContext from "../DispatchContext";

import PostCard from "./PostCard";
import LoadingIcon from "./LoadingIcon";

function Search() {
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    searchTerm: "",
    searchResults: [],
    show: "neither",
    requestCount: 0,
  });

  useEffect(() => {
    // Listen for any time the user press any key in the keyboard
    document.addEventListener("keyup", searchKeyPressHandler);
    // Clean up our event listener when component was unmounted
    return () => {
      document.removeEventListener("keyup", searchKeyPressHandler);
    };
  }, []);

  useEffect(() => {
    if (state.searchTerm.trim()) {
      // In the very second the user type any thing show circle loader
      setState((draft) => {
        draft.show = "loading";
      });
      // after 700ms start sending a network request
      const timer = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
          draft.show = "loading";
        });
      }, 700);

      // If another key was just pressed before that amount of time (3000ms),
      // then useEffect clean function will cancel that existing timeout timer above.
      return () => clearTimeout(timer);
    } else {
      setState((draft) => {
        draft.show = "neither";
      });
    }
  }, [state.searchTerm]);

  // Send off a network request to our backend server
  useEffect(() => {
    // If requestCount greater than 0 send our request
    // and the user was already wrote a search term in the search input
    // so, search input must not be empty in order to send our network request
    if (state.requestCount) {
      const request = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/search",
            { searchTerm: state.searchTerm },
            { cancelToken: request.token }
          );
          setState((draft) => {
            draft.searchResults = response.data;
            draft.show = "results";
          });
        } catch (err) {
          console.log("There was a problem or the request was canceled.");
        }
      }
      fetchResults();
      return () => request.cancel();
    }
  }, [state.requestCount]);

  function handleInput(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  }

  function searchKeyPressHandler(e) {
    // Only if the key was just pressed is the Escape key, then close the search overlay
    if (e.key === "Escape") {
      appDispatch({ type: "closeSearch" });
    }
  }

  return (
    <>
      <div className="c-live-search__top">
        <div className="o-container o-container--medium">
          <div className="c-live-search__field">
            <label htmlFor="live-search-field">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 100 100"
              >
                <switch>
                  <g>
                    <path d="M5273.1 2400.1v-2c0-2.8-5-4-9.7-4s-9.7 1.3-9.7 4v2c0 1.8.7 3.6 2 4.9l5 4.9c.3.3.4.6.4 1v6.4c0 .4.2.7.6.8l2.9.9c.5.1 1-.2 1-.8v-7.2c0-.4.2-.7.4-1l5.1-5c1.3-1.3 2-3.1 2-4.9zm-9.7-.1c-4.8 0-7.4-1.3-7.5-1.8.1-.5 2.7-1.8 7.5-1.8s7.3 1.3 7.5 1.8c-.2.5-2.7 1.8-7.5 1.8z"></path>
                    <path d="M5268.4 2410.3c-.6 0-1 .4-1 1s.4 1 1 1h4.3c.6 0 1-.4 1-1s-.4-1-1-1h-4.3zm4.3 3.4h-4.3c-.6 0-1 .4-1 1s.4 1 1 1h4.3c.6 0 1-.4 1-1s-.4-1-1-1zm0 3.3h-4.3c-.6 0-1 .4-1 1s.4 1 1 1h4.3c.6 0 1-.4 1-1 0-.5-.4-1-1-1zM42.4 23.1c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c4.7 0 8.6 3.9 8.6 8.6 0 3 2.4 5.4 5.4 5.4s5.4-2.4 5.4-5.4c0-10.7-8.7-19.4-19.4-19.4z"></path>
                    <path d="M95.8 87.3L74.5 66.1c4.9-6.6 7.8-14.8 7.8-23.7 0-22-17.9-39.9-39.9-39.9S2.5 20.4 2.5 42.4s17.9 39.9 39.9 39.9c8.9 0 17-2.9 23.7-7.8l21.2 21.2c1.2 1.2 2.7 1.7 4.2 1.7s3.1-.6 4.2-1.7c2.4-2.3 2.4-6.1.1-8.4zM14.4 42.4c0-15.4 12.6-28 28-28s28 12.6 28 28-12.6 28-28 28-28-12.5-28-28z"></path>
                  </g>
                </switch>
              </svg>
            </label>
            <input
              onChange={handleInput}
              autoFocus
              type="text"
              autoComplete="off"
              id="live-search-field"
              className="live-search-field"
              placeholder="What are you interested in?"
            />
            <span
              onClick={() => appDispatch({ type: "closeSearch" })}
              className="c-live-search__close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 27 27"
              >
                <path
                  fillRule="evenodd"
                  d="M16.277 13.036l9.997-9.995c.7-.7.696-1.821 0-2.518a1.774 1.774 0 00-2.513 0l-9.996 9.996L3.77.523a1.77 1.77 0 00-2.513 0 1.776 1.776 0 000 2.518l9.996 9.995-9.996 9.992c-.7.7-.696 1.82 0 2.516.696.7 1.817.697 2.513 0l9.995-9.996 9.996 9.996c.7.7 1.821.697 2.513 0 .7-.7.696-1.82 0-2.516l-9.997-9.992z"
                ></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div className="c-live-search__bottom">
        <div className="o-container o-container--narrow">
          {state.show == "loading" && (
            <div className="c-live-search__loading">
              <LoadingIcon theme="light" />
            </div>
          )}
          <div
            className={
              "c-live-search__results " +
              (state.show == "results" ? "is-visible" : "")
            }
          >
            {Boolean(state.searchResults.length) && (
              <ul className="o-list u-flow">
                <div className="c-live-search__state">
                  <p>
                    <strong>Search Results</strong> (
                    {state.searchResults.length}{" "}
                    {state.searchResults.length == 1 ? "item" : "items"} found)
                  </p>
                </div>
                {state.searchResults.map((post) => {
                  return (
                    <PostCard
                      post={post}
                      key={post._id}
                      onClick={() => {
                        appDispatch({ type: "closeSearch" });
                      }}
                      className="c-post-card--search"
                      avatarState="black"
                    />
                  );
                })}
              </ul>
            )}
            {!Boolean(state.searchResults.length) && (
              <div className="c-live-search__state">
                <p className="u-align-center">
                  Sorry, we could not find any results for that search. Try
                  again.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
