import React from "react";
import { Link } from "react-router-dom";

function PostCard({ post, onClick, isAuthorHidden, className }) {
  const { title, createdDate, _id, author } = post;
  const date = new Date(createdDate);
  const dateFormatted = `
          ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}
        `;
  return (
    <li>
      <Link to={`/post/${_id}`} onClick={onClick}>
        <div className={"c-post-card " + (className ? className : "")}>
          <h2 className="c-post-card__title">{title}</h2>{" "}
          <span className={`c-post-card__date ${!isAuthorHidden && "u-mb-3"}`}>
            on {dateFormatted}
          </span>
          <div className="c-post-card__author">
            {!isAuthorHidden && (
              <>
                <div className="c-avatar c-avatar--blue">
                  <span className="c-avatar__firstletter">
                    {author.username.slice(0, 1).toUpperCase()}{" "}
                  </span>
                  <img
                    src={author.avatar}
                    alt={`Profile picture of ${author.username}`}
                  />
                </div>
                <span className="c-post-card__username">{author.username}</span>
              </>
            )}{" "}
          </div>
        </div>
      </Link>
    </li>
  );
}

export default PostCard;
