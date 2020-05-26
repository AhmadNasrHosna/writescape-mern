import React from "react";
import { Link } from "react-router-dom";

import Page from "./Page";
import Container from "./Container";
import Login from "./Login";

function LoginPage() {
  return (
    <Page title="Login">
      <section className="o-section o-section--login-screen">
        <Container wide="medium">
          <div className="o-section__inner u-flow u-flow--4">
            <h2 className="o-section__title">Login</h2>
            <div className="c-login">
              <div className="c-login__form u-flow">
                <Login />
                <p>
                  New user? <Link to="/register">Sign up</Link> to create your
                  account.
                </p>
              </div>
              <div className="c-login__illustration">
                <img
                  src="../assets/images/svg/login-illustration.svg"
                  alt="Login Illustration"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Page>
  );
}

export default LoginPage;
