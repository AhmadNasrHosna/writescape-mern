import React, { useEffect, useContext } from "react";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
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
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
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

  function isVisitorNotOwner() {
    if (!appState.loggedIn) return;
    // Now user logged in!
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
    <Page title={username + " profile"}>
      <Container>
        <h2>
          <img className="avatar-small" src={state.profileData.profileAvatar} />{" "}
          {state.profileData.profileUsername}
          {isVisitorNotOwner() &&
            !state.profileData.isFollowing &&
            state.profileData.profileUsername != "..." && (
              <button
                onClick={startFollowing}
                disabled={state.followActionLoading}
                className="btn btn-primary btn-sm ml-2"
              >
                Follow <i className="fas fa-user-plus"></i>
              </button>
            )}
          {isVisitorNotOwner() &&
            state.profileData.isFollowing &&
            state.profileData.profileUsername != "..." && (
              <button
                onClick={stopFollowing}
                disabled={state.followActionLoading}
                className="btn btn-danger btn-sm ml-2"
              >
                Stop Following <i className="fas fa-user-times"></i>
              </button>
            )}
        </h2>

        <div className="profile-nav nav nav-tabs pt-2 mb-4">
          <NavLink
            exact
            to={`/profile/${username}`}
            className="nav-item nav-link"
          >
            Posts: {state.profileData.counts.postCount}
          </NavLink>
          <NavLink
            to={`/profile/${username}/followers`}
            className="nav-item nav-link"
          >
            Followers: {state.profileData.counts.followerCount}
          </NavLink>
          <NavLink
            to={`/profile/${username}/following`}
            className="nav-item nav-link"
          >
            Following: {state.profileData.counts.followingCount}
          </NavLink>
        </div>

        <Switch>
          <Route exact path={"/profile/:username"}>
            <ProfilePosts />
          </Route>
          <Route path={"/profile/:username/followers"}>
            <ProfileFollow
              urlPath="/followers"
              followerCount={state.profileData.counts.followerCount}
            />
          </Route>
          <Route path={"/profile/:username/following"}>
            <ProfileFollow
              urlPath="/following"
              followingCount={state.profileData.counts.followingCount}
            />
          </Route>
        </Switch>
      </Container>
    </Page>
  );
}

export default Profile;
