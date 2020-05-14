import React from "react";
import { Link } from "react-router-dom";

function PostCard({ post, onClick, isAuthorHidden }) {
  const { title, createdDate, _id, author } = post;
  const date = new Date(createdDate);
  const dateFormatted = `
          ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}
        `;
  return (
    <Link
      to={`/post/${_id}`}
      onClick={onClick}
      className="list-group-item list-group-item-action"
    >
      <img className="avatar-tiny" src={author.avatar} />
      <strong>{title}</strong>{" "}
      {!isAuthorHidden && (
        <span className="text-muted small">by {author.username}</span>
      )}{" "}
      <span className="text-muted small">on {dateFormatted}</span>
    </Link>
  );
}

export default PostCard;
