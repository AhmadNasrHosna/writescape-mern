import React from "react";

function ComponentName({ messages }) {
  return (
    <div className="floating-alerts">
      {messages.map((msg, index) => {
        return (
          <div
            key={index}
            className="alert alert-success text-center floating-alert shadow-sm"
          >
            {msg}
          </div>
        );
      })}
    </div>
  );
}

export default ComponentName;
