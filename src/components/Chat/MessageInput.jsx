import React, { useState } from "react";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage(""); // Clear the input field after sending
    }
  };

  return (
    <form onSubmit={handleSendMessage} style={{ marginTop: "10px" }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "80%", padding: "10px" }}
      />
      <button type="submit" style={{ padding: "10px" }}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;