import React from "react";

function ComponentName({ messages }) {
  return (
    <div className="c-floating-alerts">
      {messages.map((msg, index) => {
        return (
          <div key={index} className="c-alert">
            {msg}
          </div>
        );
      })}
    </div>
  );
}

export default ComponentName;
