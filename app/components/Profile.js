import React, { useEffect, useContext, useRef } from "react";
import {
  useParams,
  NavLink,
  Switch,
  Route,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import { useImmer } from "use-immer";
import Axios from "axios";

import StateContext from "../StateContext";

import Page from "./Page";
import Container from "./Container";
import ProfilePosts from "./ProfilePosts";
import ProfileFollow from "./ProfileFollow";
import NotFound from "./NotFound";

function Profile() {
  const { username } = useParams();
  const match = useRouteMatch();
  const location = useLocation();

  console.log(location);
  const appState = useContext(StateContext);
  const profileNav = useRef(null);
  const floatingUnderline = useRef(null);

  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://www.gravatar.com/avatar/0000?d=blank",
      isFollowing: false,
      counts: {
        postCount: "",
        followerCount: "",
        followingCount: "",
      },
    },
    notFound: false,
  });

  // Send off a network request to our backend server
  // in order to get profile data
  useEffect(() => {
    setState((draft) => {
      draft.notFound = false;
    });
    const request = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          { token: appState.user.token },
          { cancelToken: request.token }
        );
        if (response.data) {
          setState((draft) => {
            draft.profileData = response.data;
          });
        } else {
          setState((draft) => {
            draft.notFound = true;
          });
        }
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }
    fetchData();
    return () => request.cancel();
  }, [username]);

  // Send off a network request to our backend server
  // in order to add follow
  useEffect(() => {
    // Don't execute at mounting
    if (state.startFollowingRequestCount) {
      // stopFollowingRequestCount was updated start executing
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const request = Axios.CancelToken.source();
      async function sendData() {
        try {
          await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            { token: appState.user.token },
            { cancelToken: request.token }
          );
          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (err) {
          console.log("There was a problem or the request was canceled.");
        }
      }
      sendData();
      return () => request.cancel();
    }
  }, [state.startFollowingRequestCount]);

  // Send off a network request to our backend server
  // in order to remove follow
  useEffect(() => {
    // Don't execute at mounting
    if (state.stopFollowingRequestCount) {
      // stopFollowingRequestCount was updated start executing
      setState((draft) => {
        draft.followActionLoading = true;
      });
      const request = Axios.CancelToken.source();
      async function sendData() {
        try {
          await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            { token: appState.user.token },
            { cancelToken: request.token }
          );
          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (err) {
          console.log("There was a problem or the request was canceled.");
        }
      }
      sendData();
      return () => request.cancel();
    }
  }, [state.stopFollowingRequestCount]);

  // Animated Underline  Effect
  useEffect(() => {
    const triggers = profileNav.current.querySelectorAll(
      ".c-profile__nav-link"
    );

    triggers.forEach((link) => {
      if (link.classList.contains("active")) {
        animateTheUnderline(link);
      }
    });

    const handleUnderlineAnimation = (e) => {
      clearTimer();
      animateTheUnderline(e.currentTarget);
    };

    function animateTheUnderline(elem) {
      floatingUnderline.current.style.opacity = "1";
      floatingUnderline.current.style.width = elem.offsetWidth + "px";
      floatingUnderline.current.style.transform = `translate(${
        elem.offsetLeft
      }px, ${elem.offsetTop + elem.offsetHeight}px)`;
    }

    triggers.forEach((link) =>
      link.addEventListener("mouseenter", handleUnderlineAnimation)
    );

    let timer;

    triggers.forEach((link) =>
      link.addEventListener("mouseleave", () => {
        timer = setTimeout(() => {
          triggers.forEach((link) => {
            if (link.classList.contains("active")) {
              animateTheUnderline(link);
            }
          });
        }, 100);
      })
    );

    function clearTimer() {
      clearTimeout(timer);
    }
  }, [match.url, location.pathname]);

  // -----------------

  function isVisitorNotOwner() {
    if (!appState.loggedIn) return;
    // Now user was logged in!
    return appState.user.username != state.profileData.profileUsername;
  }

  function startFollowing() {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  }

  function stopFollowing() {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  }

  if (state.notFound) {
    return <NotFound />;
  }

  return (
    <Page title={state.profileData.profileUsername + " profile"}>
      <div className="c-profile">
        <header className="c-profile__header">
          <Container wide="medium">
            {" "}
            <div className="c-profile__user">
              <div className="c-avatar c-avatar--red c-avatar--profile">
                <span className="c-avatar__firstletter">
                  {state.profileData.profileUsername.slice(0, 1).toUpperCase()}
                </span>
                <img
                  src={state.profileData.profileAvatar}
                  alt={`Profile picture of ${state.profileData.profileUsername}`}
                ></img>
              </div>

              <h2 className="c-profile__username">
                {state.profileData.profileUsername}
              </h2>

              {isVisitorNotOwner() &&
                !state.profileData.isFollowing &&
                state.profileData.profileUsername != "..." && (
                  <div className="c-profile__actions">
                    <button
                      onClick={startFollowing}
                      disabled={state.followActionLoading}
                      className="c-button c-button--inverse c-button--medium c-button--icon c-button--shadow"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        x="0"
                        y="0"
                        viewBox="27 25 48 48"
                      >
                        <path
                          fillRule="nonzero"
                          d="M55.385 67.5H31.993a2.001 2.001 0 01-1.993-2c0-8.737 6.512-13 17-13 5.078 0 9.224 1 12.15 3.022a7.986 7.986 0 00-1.998 1.114C54.644 55.206 51.218 54.5 47 54.5c-9.517 0-15 3.59-15 11 0-.002 13.508-.001 22.398 0 .236.716.57 1.389.987 2zM47 51.5c-5.199 0-9-5.869-9-12 0-5.918 3.73-11 9-11s9 5.082 9 11c0 6.131-3.801 12-9 12zm0-2c3.866 0 7-4.838 7-10 0-4.924-2.991-9-7-9s-7 4.076-7 9c0 5.162 3.134 10 7 10zM62 72a9 9 0 110-18 9 9 0 010 18zm0-2a7 7 0 100-14 7 7 0 000 14zm3-8a1 1 0 010 2h-1.75a.25.25 0 00-.25.25V66a1 1 0 01-2 0v-1.75a.25.25 0 00-.25-.25H59a1 1 0 010-2h1.75a.25.25 0 00.25-.25V60a1 1 0 012 0v1.75c0 .138.112.25.25.25H65z"
                        ></path>
                      </svg>
                      Follow
                    </button>
                  </div>
                )}
              {isVisitorNotOwner() &&
                state.profileData.isFollowing &&
                state.profileData.profileUsername != "..." && (
                  <div className="c-profile__actions">
                    <button
                      onClick={stopFollowing}
                      disabled={state.followActionLoading}
                      className="c-button c-button--primary c-button--medium c-button--icon c-button--shadow"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        x="0"
                        y="0"
                        viewBox="27 25 48 48"
                      >
                        <path
                          fillRule="nonzero"
                          d="M31.993 67.5a2.001 2.001 0 01-1.993-2c0-8.737 6.512-13 17-13 5.078 0 9.224 1 12.15 3.022a7.986 7.986 0 00-1.998 1.114C54.644 55.206 51.218 54.5 47 54.5c-9.517 0-15 3.59-15 11 0-.002 13.508-.001 22.398 0 .236.716.57 1.389.987 2H31.993zM47 51.5c-5.199 0-9-5.869-9-12 0-5.918 3.73-11 9-11s9 5.082 9 11c0 6.131-3.801 12-9 12zm0-2c3.866 0 7-4.838 7-10 0-4.924-2.991-9-7-9s-7 4.076-7 9c0 5.162 3.134 10 7 10zM62 72a9 9 0 110-18 9 9 0 010 18zm0-2a7 7 0 100-14 7 7 0 000 14zm3-8a1 1 0 010 2h-6a1 1 0 010-2h6z"
                        ></path>
                      </svg>
                      Stop Following
                    </button>
                  </div>
                )}
            </div>
          </Container>
          <nav className="c-profile__nav" ref={profileNav}>
            <Container wide="medium">
              <span
                className="c-profile__floating-underline"
                ref={floatingUnderline}
              ></span>
              <ul className="o-list o-list--inline">
                <li>
                  <NavLink
                    exact
                    to={`${match.url}`}
                    className="c-profile__nav-link"
                  >
                    Posts:{" "}
                    <span className="c-profile__count">
                      {state.profileData.counts.postCount}
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`${match.url}/followers`}
                    className="c-profile__nav-link"
                  >
                    Followers:{" "}
                    <span className="c-profile__count">
                      {state.profileData.counts.followerCount}
                    </span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to={`${match.url}/following`}
                    className="c-profile__nav-link"
                  >
                    Following:{" "}
                    <span className="c-profile__count">
                      {state.profileData.counts.followingCount}
                    </span>
                  </NavLink>
                </li>
              </ul>
            </Container>
          </nav>
        </header>
      </div>
      <Container wide="medium">
        <section className="c-profile__content">
          {" "}
          <Switch>
            <Route exact path={`${match.path}`}>
              <ProfilePosts />
            </Route>
            <Route path={`${match.path}/followers`}>
              <ProfileFollow
                urlPath="/followers"
                followerCount={state.profileData.counts.followerCount}
              />
            </Route>
            <Route path={`${match.path}/following`}>
              <ProfileFollow
                urlPath="/following"
                followingCount={state.profileData.counts.followingCount}
              />
            </Route>
          </Switch>
        </section>
      </Container>
    </Page>
  );
}

export default Profile;
