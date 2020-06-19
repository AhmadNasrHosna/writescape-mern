import React, { useState, useEffect, useRef } from "react";

import Tab from "./Tab";

function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const tabsHeader = useRef(null);
  const floatingUnderline = useRef(null);

  function onClickTabItem(tab) {
    setActiveTab(tab);
  }

  // Animated Underline Effect
  useEffect(() => {
    let timer;

    const triggers = tabsHeader.current.querySelectorAll(".c-tab");

    floatingUnderline.current.style.top = `${triggers[0].offsetHeight - 8}px`;
    floatingUnderline.current.style.height = "8px";

    triggers.forEach((link) => {
      link.addEventListener("mouseenter", handleMouseEnter);
    });

    triggers.forEach((link) => {
      link.addEventListener("mouseleave", handleMouseLeave);
    });

    triggers.forEach((link) => {
      if (link.classList.contains("is-active")) {
        animateTheUnderline(link);
      }
    });

    function handleMouseEnter(e) {
      clearTimeout(timer);
      animateTheUnderline(e.currentTarget);
    }

    function handleMouseLeave() {
      timer = setTimeout(() => {
        triggers.forEach((link) => {
          if (link.classList.contains("is-active")) {
            animateTheUnderline(link);
          }
        });
      }, 100);
    }

    function animateTheUnderline(elem) {
      floatingUnderline.current.style.opacity = "1";
      floatingUnderline.current.style.width = elem.offsetWidth + "px";
      floatingUnderline.current.style.transform = `translate(${elem.offsetLeft}px, ${elem.offsetTop}px)`;
    }

    return function cleanupListener() {
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="c-tabs">
      <header
        className="c-login-panel__header"
        ref={tabsHeader}
        style={{ position: "relative" }}
      >
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
        <span className="c-floating-underline" ref={floatingUnderline}></span>
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
