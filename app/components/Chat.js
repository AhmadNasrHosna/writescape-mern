import React, { useEffect, useContext, useRef } from "react";
import { useImmer } from "use-immer";
import { Link } from "react-router-dom";

import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

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
    chatLog.current.querySelector(
      ".simplebar-content-wrapper"
    ).scrollTop = chatLog.current.querySelector(
      ".simplebar-content-wrapper"
    ).scrollHeight;

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

    if (state.fieldValue.trim() == "") return;

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
    <div className={"c-chat " + (isChatOpen ? "c-chat--is-visible" : "")}>
      <div
        className="c-chat__title-bar"
        onClick={() => appDispatch({ type: "toggleChat" })}
      >
        <div className="c-avatar c-avatar--red c-avatar--chat">
          <span className="c-avatar__firstletter">
            {user.username.slice(0, 1).toUpperCase()}
          </span>
          <img src={user.avatar} alt={`Profile picture of ${user.username}`} />
        </div>
        <span>Chat Messaging</span>
        <span className="c-chat__new-message">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            fill="#fff"
            viewBox="0 0 100 100"
            className="u-va-middle"
          >
            <switch>
              <g>
                <path d="M63.9 10H36.1C17.6 10 2.5 25.1 2.5 43.6c0 11.3 5.7 21.8 15 28-1.6 3.1-3.2 5.8-4.8 8-1.7 2.3-1.7 5.2-.1 7.5 1.2 1.8 3.2 2.9 5.4 2.9.6 0 1.2-.1 1.7-.2 11.2-3 21.4-8.4 28.1-12.6h16.1c18.5 0 33.6-15.1 33.6-33.6S82.4 10 63.9 10zm0 61.9H47c-.5 0-1 .1-1.4.4-5.3 3.3-15.9 9.3-27.4 12.4-.8.2-1.2-.3-1.4-.5-.2-.2-.5-.8 0-1.5 2.2-3 4.3-6.7 6.4-11 .6-1.2.1-2.7-1.1-3.4-8.9-5-14.5-14.5-14.5-24.7 0-15.6 12.7-28.3 28.3-28.3h27.8C79.3 15.3 92 28 92 43.6S79.5 71.9 63.9 71.9z"></path>
                <path d="M63.1 42.5H52.6V32c0-1.4-1.2-2.6-2.6-2.6s-2.6 1.2-2.6 2.6v10.5H36.9c-1.4 0-2.6 1.2-2.6 2.6s1.2 2.6 2.6 2.6h10.5v10.5c0 1.4 1.2 2.6 2.6 2.6s2.6-1.2 2.6-2.6V47.8h10.5c1.4 0 2.6-1.2 2.6-2.6s-1.1-2.7-2.6-2.7z"></path>
              </g>
            </switch>
          </svg>
        </span>
      </div>
      <div className="c-chat__log" ref={chatLog}>
        <SimpleBar style={{ maxHeight: 242 }} forceVisible="y" autoHide={false}>
          {state.chatMessages.map(({ message, username, avatar }, index) => {
            if (username == user.username) {
              return (
                <div className="c-chat__self" key={index}>
                  <div className="c-chat__message">
                    <div className="c-chat__message-inner">{message}</div>
                  </div>
                  <div className="c-avatar c-avatar--red c-avatar--tiny">
                    <span className="c-avatar__firstletter">
                      {username.slice(0, 1).toUpperCase()}
                    </span>
                    <img src={avatar} alt={`Profile picture of ${username}`} />
                  </div>
                </div>
              );
            }
            return (
              <div className="c-chat__other" key={index}>
                <Link to={`/profile/${username}`}>
                  <div className="c-avatar c-avatar--red c-avatar--tiny">
                    <span className="c-avatar__firstletter">
                      {username.slice(0, 1).toUpperCase()}
                    </span>
                    <img src={avatar} alt={`Profile picture of ${username}`} />
                  </div>
                </Link>
                <div className="c-chat__message">
                  <div className="c-chat__message-inner">
                    <Link to={`/profile/${username}`}>
                      <strong>{username}: </strong>
                    </Link>
                    {message}
                  </div>
                </div>
              </div>
            );
          })}
        </SimpleBar>
      </div>
      <form onSubmit={handleSubmit} className="c-chat__form">
        <input
          type="text"
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
