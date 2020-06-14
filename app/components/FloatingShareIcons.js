import React from "react";

function FloatingShareIcons({ title }) {
  const postURL = window.location.href;
  const postTitle = title;
  console.log(postURL + " ________________________");
  return (
    <div className="c-share">
      <div className="c-share__inner">
        <span>Share on</span>
        <ul className="c-share__icons o-list">
          <li>
            <a
              href={`https://twitter.com/intent/tweet/?text=${encodeURIComponent(
                postTitle
              )}&amp;url=${postURL}`}
              aria-label="Twitter"
            >
              <img src="../assets/images/svg/tw.svg" alt="Twitter" />
            </a>
          </li>
          <li>
            <a href="#0">
              <img src="../assets/images/svg/fb.svg" alt="Facebook" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FloatingShareIcons;
