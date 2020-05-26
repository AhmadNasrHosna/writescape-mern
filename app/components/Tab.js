import React from "react";

function Tab({ label, onClick, activeTab }) {
  let className = "c-tab";

  if (activeTab == label) {
    className += " is-active";
  }

  function handelClick() {
    onClick(label);
  }

  return (
    <button className={className} onClick={handelClick}>
      {label}
    </button>
  );
}

export default Tab;
