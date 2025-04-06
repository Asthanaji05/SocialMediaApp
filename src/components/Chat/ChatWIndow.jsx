import React from "react";
import MessageInput from "./MessageInput";

const ChatWindow = ({ selectedChat, currentUserId, onSendMessage }) => {
  if (!selectedChat) {
    return <h3 style={{ padding: "10px" }}>Select a chat to start messaging</h3>;
  }

  return (
    <div style={{ flex: 1, padding: "10px" }}>
      <h3>
        Chat with{" "}
        {selectedChat.participants
          .filter((p) => p._id !== currentUserId)
          .map((p) => p.firstName)
          .join(", ")}
      </h3>
      <div style={{ height: "70vh", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
  {selectedChat.messages.length > 0 ? (
    selectedChat.messages.map((msg, index) => (
      <div key={index} style={{ marginBottom: "10px" }}>
        <strong>{msg.sender.firstName}:</strong> {msg.content}
      </div>
    ))
  ) : (
    <p>No messages yet. Start the conversation!</p>
  )}
</div>
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;