import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

import StateContext from "../StateContext";

import Page from "./Page";
import Container from "./Container";
import ProfilePosts from "./ProfilePosts";

function Profile() {
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [profileData, setProfileData] = useState({
    profileUsername: "...",
    profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" },
  });

  // Send off a network request to our backend server
  useEffect(() => {
    const request = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          { token: appState.user.token },
          { cancelToken: request.token }
        );

        setProfileData(response.data);
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }

    fetchData();

    return () => request.cancel();
  }, []);

  return (
    <Page title={username + " profile"}>
      <Container>
        <h2>
          <img className="avatar-small" src={profileData.profileAvatar} />{" "}
          {profileData.profileUsername}
          <button className="btn btn-primary btn-sm ml-2">
            Follow <i className="fas fa-user-plus"></i>
          </button>
        </h2>

        <div className="profile-nav nav nav-tabs pt-2 mb-4">
          <a href="#" className="active nav-item nav-link">
            Posts: {profileData.counts.postCount}
          </a>
          <a href="#" className="nav-item nav-link">
            Followers: {profileData.counts.followerCount}
          </a>
          <a href="#" className="nav-item nav-link">
            Following: {profileData.counts.followingCount}
          </a>
        </div>

        <ProfilePosts username={username} />
      </Container>
    </Page>
  );
}

export default Profile;
