import React from "react";

function FloatingShareIcons() {
  return (
    <div className="c-share">
      <div className="c-share__inner">
        <span>Share on</span>
        <ul className="c-share__icons o-list">
          <li>
            <a href="#0">
              <img src="../assets/images/svg/fb.svg" alt="Facebook" />
            </a>
          </li>
          <li>
            <a href="#0">
              <img src="../assets/images/svg/tw.svg" alt="Twitter" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FloatingShareIcons;
