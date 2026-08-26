"use client";

import { useEffect, useState } from "react";
import socket from "../lib/socket";

export default function Chat({ requestId, token, userId }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token || !requestId) {
      return;
    }

    socket.auth = {
      token: token,
    };

    socket.connect();

    socket.emit("join_request", requestId);

    const handleReceiveMessage = (data) => {
      setMessages((previousMessages) => [...previousMessages, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    const handleJoined = (data) => {
      console.log("Joined chat:", data);
    };

    socket.on("joined_request", handleJoined);

    const handleError = (data) => {
      console.error("Chat error:", data);
    };

    socket.on("chat_error", handleError);

    return () => {
      socket.emit("leave_request", requestId);

      socket.off("receive_message", handleReceiveMessage);

      socket.off("joined_request", handleJoined);

      socket.off("chat_error", handleError);

      socket.disconnect();
    };
  }, [requestId, token]);

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }

    socket.emit("send_message", {
      requestId,
      message,
    });

    setMessage("");
  };

  return (
    <div>
      <h2>Helpbridge Chat</h2>

      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>User {msg.senderId}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
