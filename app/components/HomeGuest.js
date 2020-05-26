import React from "react";

import Page from "./Page";
import Container from "./Container";
import Register from "./Register";
import Login from "./Login";
import Tabs from "./Tabs";

function HomeGuest() {
  return (
    <Page scope="homeguest">
      <section className="o-section">
        <Container wide={true}>
          <div className="c-homeguest-hero">
            <Container wide={"medium"}>
              <div className="c-homeguest-hero__inner">
                <div className="c-homeguest-hero__text">
                  <h1 className="c-homeguest-hero__title">Remember Writing?</h1>
                  <p className="c-homeguest-hero__preview">
                    Are you sick of short tweets and impersonal
                    &ldquo;shared&rdquo; posts that are reminiscent of the late
                    90&rsquo;s email forwards? We believe getting back to
                    actually writing is the key to enjoying the internet again.
                  </p>
                </div>
                <div className="c-homeguest-hero__illustration">
                  <img
                    src="../assets/images/svg/homepage-hero-illustration.svg"
                    alt="Homepage Hero Illustration"
                  />
                </div>
              </div>
            </Container>
          </div>
        </Container>
      </section>
      <section className="o-section o-section--login u-align-center">
        <div className="o-container u-flow u-flow--5">
          <h2 className="o-section__title">Join Us</h2>
          <div className="c-login-panel">
            <Tabs>
              <div label="Login">
                <Login />
              </div>
              <div label="Sign up">
                <Register />
              </div>
            </Tabs>
          </div>
        </div>
      </section>
    </Page>
  );
}

export default HomeGuest;
