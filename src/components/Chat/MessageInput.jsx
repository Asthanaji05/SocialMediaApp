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
<form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-4">
  <input
    type="text"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Type a message..."
    className="flex-1 h-10 bg-gray-100 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
  />
  <button
    type="submit"
    className="bg-[var(--primary-color)] text-white px-4 py-2 rounded-full hover:opacity-90 transition"
  >
    Send
  </button>
</form>

  );
};

export default MessageInput;