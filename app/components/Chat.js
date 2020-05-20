import React, { useEffect, useContext, useRef } from "react";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

import io from "socket.io-client";

function Chat() {
  const { isChatOpen, user, loggedIn } = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const chatField = useRef(null);
  const chatLog = useRef(null);
  const socket = useRef(null);

  const [state, setState] = useImmer({
    fieldValue: "",
    chatMessages: [],
  });

  useEffect(() => {
    // Only if the chat was just opened
    if (isChatOpen) {
      chatField.current.focus();
      appDispatch({ type: "clearUnreadChatCount" });
    }
  }, [isChatOpen]);

  useEffect(() => {
    // Close the chat if it was opened on log out
    if (!loggedIn) {
      appDispatch({ type: "closeChat" });
    }
  }, [loggedIn]);

  useEffect(() => {
    // Scroll to the bottom of the chat log to see the new message
    chatLog.current.scrollTop = chatLog.current.scrollHeight;

    if (state.chatMessages.length && !isChatOpen) {
      appDispatch({ type: "incrementUnreadChatCount" });
    }
  }, [state.chatMessages]);

  useEffect(() => {
    // Reopening socket connection on log back in
    socket.current = io(
      process.env.BACKENDURL || "https://writescape-api.herokuapp.com"
    );

    // Receive messages from chat server
    socket.current.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });

    // End socket connection on log out
    return () => socket.current.disconnect();
  }, []);

  function handleFieldChange(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.fieldValue = value;
    });
  }

  function handleSubmit(e) {
    // 1. Prevent the browser default behavior of submitting a form
    e.preventDefault();

    // 2. Send messages to chat server
    socket.current.emit("chatFromBrowser", {
      message: state.fieldValue,
      token: user.token,
    });

    setState((draft) => {
      // 3. Add message to state collection of messages
      draft.chatMessages.push({
        message: draft.fieldValue,
        username: user.username,
        avatar: user.avatar,
      });

      // 4. Clear the input field after sending a message
      draft.fieldValue = "";
    });
  }

  return (
    <div
      id="chat-wrapper"
      className={
        "chat-wrapper shadow border-top border-left border-right " +
        (isChatOpen ? "chat-wrapper--is-visible" : "")
      }
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          className="chat-title-bar-close"
          onClick={() => appDispatch({ type: "closeChat" })}
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log" ref={chatLog}>
        {state.chatMessages.map(({ message, username, avatar }, index) => {
          if (username == user.username) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{message}</div>
                </div>
                <img className="chat-avatar avatar-tiny" src={avatar} />
              </div>
            );
          }
          return (
            <div className="chat-other" key={index}>
              <Link to={`/profile/${username}`}>
                <img className="avatar-tiny" src={avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${username}`}>
                    <strong>{username}: </strong>
                  </Link>
                  {message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={chatField}
          value={state.fieldValue}
          onChange={handleFieldChange}
        />
      </form>
    </div>
  );
}

export default Chat;
