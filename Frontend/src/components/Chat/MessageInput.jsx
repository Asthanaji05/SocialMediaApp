import React, { useState } from "react";
import { Send, Smile, Paperclip } from "lucide-react";

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="relative flex items-center gap-3">
      <div className="flex-1 relative group">
        <button type="button" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
          <Smile size={20} />
        </button>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Broadcast a message..."
          className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-sm focus:border-[var(--primary-color)]/30 focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.05)] outline-none transition-all placeholder:text-gray-600"
        />

        <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
          <Paperclip size={20} />
        </button>
      </div>

      <button
        type="submit"
        disabled={!message.trim()}
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${message.trim()
            ? "bg-[var(--primary-color)] text-black shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:scale-105"
            : "bg-white/5 text-gray-600 cursor-not-allowed"
          }`}
      >
        <Send size={20} className={message.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
      </button>
    </form>
  );
};

export default MessageInput;