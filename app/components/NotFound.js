import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";
import Container from "./Container";

function NotFound() {
  return (
    <Page title="Not Found" scope="404">
      <section className="o-section o-section--404 u-align-center">
        <Container>
          <div className="c-404  u-flow">
            <img
              className="c-404__illustration"
              src="../assets/images/svg/404-illustration.svg"
              alt="404 Illustration"
            />
            <h2 class="c-404__title u-flow__g-s6">
              Whoops, we cannot find that page.
            </h2>
            <p class="c-404__text">
              You can always visit the <Link to="/">homepage</Link> to get a
              fresh start.
            </p>
          </div>
        </Container>
      </section>
    </Page>
  );
}

export default NotFound;
