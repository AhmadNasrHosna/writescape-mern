import React from "react";
import { Link } from "react-router-dom";

import Container from "./Container";

export default function Footer() {
  return (
    <footer className="p-footer">
      <Container wide={true}>
        <div className="p-footer__inner u-flow u-flow--6">
          <nav className="p-footer__nav">
            <ul className="o-list o-list--inline">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/terms">Terms</Link>
              </li>
            </ul>
          </nav>

          <div className="p-footer__copy">
            <p>
              Copyright © 2020 <Link to="/">Writescape</Link>. All rights
              reserved.
            </p>
          </div>

          <div className="p-footer__logo">
            <span>writescape</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
