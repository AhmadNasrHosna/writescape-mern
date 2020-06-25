import React from "react";

function LoadingIcon({ theme }) {
  return (
    <div className={"c-dots-loading " + (theme ? "c-dots-loading--light" : "")}>
      <div></div>
    </div>
  );
}

export default LoadingIcon;
