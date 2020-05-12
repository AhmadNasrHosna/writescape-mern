import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useImmer } from "use-immer";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function Search() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
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
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
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
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>
      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={
              "circle-loader " +
              (state.show == "loading" ? "circle-loader--visible" : "")
            }
          ></div>
          <div
            className={
              "live-search-results " +
              (state.show == "results" ? "live-search-results--visible" : "")
            }
          >
            {Boolean(state.searchResults.length) && (
              <div className="list-group shadow-sm">
                <div className="list-group-item active">
                  <strong>Search Results</strong> ({state.searchResults.length}{" "}
                  {state.searchResults.length == 1 ? "item" : "items"} found)
                </div>
                {state.searchResults.map(
                  ({ title, createdDate, _id, author }, index) => {
                    const date = new Date(createdDate);
                    const dateFormatted = `
          ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}
        `;
                    return (
                      <Link
                        onClick={() => appDispatch({ type: "closeSearch" })}
                        to={`/post/${_id}`}
                        key={index}
                        className="list-group-item list-group-item-action"
                      >
                        <img className="avatar-tiny" src={author.avatar} />
                        <strong>{title}</strong>{" "}
                        <span className="text-muted small">
                          by {author.username}
                        </span>{" "}
                        <span className="text-muted small">
                          on {dateFormatted}
                        </span>
                      </Link>
                    );
                  }
                )}
              </div>
            )}
            {!Boolean(state.searchResults.length) && (
              <p className="alert alert-danger text-center shadow-sm">
                Sorry, we could not find any results for that search. Try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
