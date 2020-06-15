import React from "react";

function FloatingShareIcons({ title }) {
  const postURL = window.location.href;
  const postTitle = title;

  return (
    <div className="c-share">
      <div className="c-share__inner">
        <span>Share on</span>
        <ul className="c-share__icons o-list">
          <li>
            <a
              href={`https://twitter.com/intent/tweet/?text=${encodeURIComponent(
                postTitle
              )}&url=${postURL}`}
              aria-label="Twitter"
              target="_blank"
            >
              <img src="../assets/images/svg/tw.svg" alt="Twitter" />
            </a>
          </li>
          <li>
            <a
              href={`https://facebook.com/sharer/sharer.php?u=${postURL}`}
              aria-label="Facebook"
              target="_blank"
            >
              <img src="../assets/images/svg/fb.svg" alt="Facebook" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FloatingShareIcons;
