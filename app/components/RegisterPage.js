import React from "react";
import { Link } from "react-router-dom";

import Page from "./Page";
import Container from "./Container";
import Register from "./Register";

function RegisterPage() {
  return (
    <Page title="Sign Up">
      <section className="o-section o-section--register-screen">
        <Container wide="medium">
          <div className="o-section__inner u-flow u-flow--4">
            <h2 className="o-section__title">Sign Up</h2>
            <div className="c-register">
              <div className="c-register__form u-flow">
                <Register />
                <p>
                  Already have an account? <Link to="/login">Sign in</Link>
                </p>
              </div>
              <div className="c-register__illustration">
                <img
                  src="../assets/images/svg/register-illustration.svg"
                  alt="Register Illustration"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Page>
  );
}

export default RegisterPage;
