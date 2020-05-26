import React, { useState, useEffect } from "react";

import Tab from "./Tab";

function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  function onClickTabItem(tab) {
    setActiveTab(tab);
  }

  return (
    <div className="c-tabs">
      <header className="c-login-panel__header">
        <span className="c-login-panel__or u-uppercase">or</span>
        {children.map((child) => {
          const { label } = child.props;
          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              onClick={onClickTabItem}
            />
          );
        })}
      </header>
      <section className="c-login-panel__form">
        {children.map((child) => {
          const { label, children } = child.props;
          if (label == activeTab) {
            return children;
          }
        })}
      </section>
    </div>
  );
}

export default Tabs;
