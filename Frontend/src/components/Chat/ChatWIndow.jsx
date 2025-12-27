import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { Circle, Info, Phone, Video } from "lucide-react";

const ChatWindow = ({ selectedChat, currentUserId, onSendMessage }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedChat?.messages]);

  if (!selectedChat) return null;

  const targetUser = selectedChat.participants.find(p => p._id !== currentUserId);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a]/50">

      {/* Window Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {targetUser?.image ? (
              <img src={targetUser.image} className="w-10 h-10 rounded-full object-cover border border-white/10" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                {targetUser?.firstName?.[0]}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">{targetUser?.firstName} {targetUser?.lastName}</h3>
            <p className="text-[10px] text-[var(--primary-color)] font-bold uppercase tracking-wider opacity-80">Signal Active</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          {/* Placeholder icons for immersive feel */}
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Phone size={18} /></button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Video size={18} /></button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><Info size={18} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar"
      >
        {selectedChat.messages.length > 0 ? (
          selectedChat.messages.map((msg, index) => {
            const isCurrentUser = msg.sender._id === currentUserId;
            const showTime = index === 0 ||
              new Date(msg.createdAt) - new Date(selectedChat.messages[index - 1].createdAt) > 300000;

            return (
              <div key={index} className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                {showTime && (
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-4 w-full text-center opacity-50">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                <div
                  className={`max-w-[80%] md:max-w-[70%] p-4 text-sm relative group transition-all duration-300 ${isCurrentUser
                      ? "bg-[var(--primary-color)] text-black font-medium rounded-2xl rounded-tr-none shadow-[4px_4px_20px_rgba(var(--primary-rgb),0.1)]"
                      : "bg-white/5 border border-white/5 text-gray-200 rounded-2xl rounded-tl-none hover:border-white/10 hover:bg-white/[0.07]"
                    }`}
                >
                  <p className="leading-relaxed">
                    {msg.content}
                  </p>

                  {/* Status Indicator for own messages */}
                  {isCurrentUser && (
                    <div className="absolute -right-6 bottom-1 opacity-0 group-hover:opacity-40 transition-opacity">
                      <Circle size={8} className="fill-[var(--primary-color)]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
            <Circle size={48} className="text-white mb-4 animate-pulse" />
            <p className="font-nerko text-2xl">The bridge is clear.</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-6 pb-8 pt-4">
        <MessageInput onSendMessage={onSendMessage} />
        <p className="text-[9px] text-gray-600 text-center mt-4 uppercase tracking-[0.3em] font-bold opacity-50">
          Moscownpur End-to-End Encryption Enabled
        </p>
      </div>
    </div>
  );
};

export default ChatWindow;
