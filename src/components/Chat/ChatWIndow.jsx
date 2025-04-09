import React from "react";
import MessageInput from "./MessageInput";

const ChatWindow = ({ selectedChat, currentUserId, onSendMessage }) => {
  if (!selectedChat) {
    return (
      <div className="p-4 text-gray-500">
        <h3>Select a chat to start messaging</h3>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-1 rounded-3xl">
      {/* Chat Messages */}
      <div className="h-[70vh] overflow-y-scroll border rounded-lg p-4 space-y-3 bg-black">
        {selectedChat.messages.length > 0 ? (
          selectedChat.messages.map((msg, index) => {
            const isCurrentUser = msg.sender._id === currentUserId;
            return (
<div
  key={index}
  className={`flex max-w-[24rem] p-3 text-sm shadow-sm ${
    isCurrentUser
      ? "bg-white text-black border-2 border-[var(--primary-color)] self-end ml-auto rounded-l-2xl rounded-br-2xl rounded-tr-none"
      : "bg-[var(--primary-color)] text-white rounded-r-2xl rounded-bl-2xl rounded-tl-none border-white border-2"
  }`}
>
  <p className="leading-snug">
    {!isCurrentUser && <strong>{msg.sender.userName}: </strong>}
    {msg.content}
  </p>
</div>

            );
          })
        ) : (
          <p className="text-gray-500">No messages yet. Start the conversation!</p>
        )}
      </div>

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
