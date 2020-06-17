import React, { useContext, useEffect } from "react";
import { useImmer } from "use-immer";
import Axios from "axios";

import Page from "./Page";
import Container from "./Container";
import LoadingIcon from "./LoadingIcon";
import PostCard from "./PostCard";

import StateContext from "../StateContext";

function Home() {
  const appState = useContext(StateContext);
  const [{ isLoading, feed }, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  // Send off a network request to our backend server
  // in order to fetch following users's posts
  useEffect(() => {
    const request = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const response = await Axios.post(
          "/getHomeFeed",
          { token: appState.user.token },
          { cancelToken: request.token }
        );
        setState((draft) => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (err) {
        console.log("There was a problem or the request was canceled.");
      }
    }
    fetchData();
    return () => request.cancel();
  }, []);

  if (isLoading) return <LoadingIcon />;

  return (
    <Page title="Your Feed">
      <section className="o-section o-section--feed">
        <Container>
          <div className="c-feed u-flow u-flow--5">
            <img
              className="c-feed__illustration"
              src="../assets/images/svg/feed-1-illustration.svg"
              alt="Feed Page Illustration"
            />
            {feed.length > 0 && (
              <>
                <h2 className="o-section__title o-section__title--sm u-align-center">
                  The latest from those you follow
                </h2>
                <ul className="o-list c-feed__list u-flow__g-s6">
                  {feed.map((post) => {
                    return <PostCard post={post} key={post._id} />;
                  })}
                </ul>
              </>
            )}
            {feed.length == 0 && (
              <>
                <h2 className="o-section__title o-section__title--sm u-align-center">
                  Hello{" "}
                  <strong className="u-color-text-900">
                    {appState.user.username}
                  </strong>
                  , your feed is empty.
                </h2>
                <p className="c-feed__emptyfeedmessage">
                  Your feed displays the latest posts from the people you
                  follow. If you don&rsquo;t have any friends to follow
                  that&rsquo;s okay; you can use the &ldquo;Search&rdquo;
                  feature in the top menu bar to find content written by people
                  with similar interests and then follow them.
                </p>
              </>
            )}
          </div>
        </Container>
      </section>
    </Page>
  );
}

export default Home;
