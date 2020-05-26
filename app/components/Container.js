import React from "react";

function Container({ wide, children }) {
  return (
    <div
      className={
        "o-container " +
        (wide == true
          ? ""
          : wide == "medium"
          ? "o-container--medium"
          : "o-container--narrow")
      }
    >
      {children}
    </div>
  );
}

export default Container;
