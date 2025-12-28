import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api.js";
import { Search, Plus, MessageSquare } from "lucide-react";

const ChatList = ({ chats, following, userId, onCreateChat, onSelectChat, selectedChatId }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const uniqueChats = chats.filter(
    (chat, index, self) =>
      index === self.findIndex((c) => c._id === chat._id)
  );

  const filteredChats = uniqueChats.filter(chat => {
    const targetUser = chat.participants.find(p => p._id !== userId);
    return targetUser?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      targetUser?.userName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col pt-4 md:pt-6">

      {/* Header & Search */}
      <div className="px-4 md:px-6 mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-bungee tracking-wide mb-4 md:mb-6 flex items-center gap-2">
          Transmissions
        </h2>
        <div className="relative">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search oracles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-white/5 rounded-xl md:rounded-2xl pl-9 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 text-sm focus:border-[var(--primary-color)]/50 focus:ring-1 focus:ring-[var(--primary-color)]/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 md:px-3 pb-4 md:pb-6">

        {/* Active Chats Section */}
        <div className="mb-6 md:mb-8">
          <p className="text-[9px] md:text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] px-2 md:px-3 mb-3 md:mb-4">Active Threads</p>
          <div className="space-y-1">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => {
                const targetUser = chat.participants.find((p) => p._id !== userId);
                const isSelected = selectedChatId === chat._id;
                const lastMessage = chat.messages?.[chat.messages.length - 1];

                // Calculate unread signals sent by others
                const unreadCount = chat.messages?.filter(m => {
                  const senderId = typeof m.sender === 'object' ? m.sender._id : m.sender;
                  return senderId !== userId && !m.read;
                }).length || 0;

                return (
                  <div
                    key={chat._id}
                    onClick={() => onSelectChat(chat)}
                    className={`group flex items-center gap-3 p-2.5 md:p-3 rounded-xl md:rounded-2xl cursor-pointer transition-all duration-300 ${isSelected
                      ? "bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/20 shadow-[0_0_15px_rgba(var(--primary-rgb),0.05)]"
                      : "hover:bg-white/5 border border-transparent"
                      }`}
                  >
                    <div className="relative shrink-0">
                      {targetUser?.image ? (
                        <img src={targetUser.image} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border border-white/10" />
                      ) : (
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/10 text-sm md:text-base">
                          {targetUser?.firstName?.[0]}
                        </div>
                      )}
                      {isSelected ? (
                        <div className="absolute -bottom-0 -right-0 w-3 h-3 md:w-3.5 md:h-3.5 bg-[var(--primary-color)] border-2 border-black rounded-full shadow-[0_0_10px_var(--primary-color)]"></div>
                      ) : (
                        unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-[16px] h-[16px] md:min-w-[18px] md:h-[18px] bg-[var(--primary-color)] text-black text-[9px] md:text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-[0_0_10px_var(--primary-color)]">
                            {unreadCount}
                          </div>
                        )
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h4 className={`font-bold truncate text-sm md:text-base ${isSelected ? "text-white" : unreadCount > 0 ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                          {targetUser?.firstName} {targetUser?.lastName}
                        </h4>
                        <span className={`text-[9px] md:text-[10px] shrink-0 ${unreadCount > 0 ? "text-[var(--primary-color)] font-bold" : "text-gray-500"}`}>
                          {lastMessage ? new Date(lastMessage.createdAt || lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>
                      <p className={`text-[10px] md:text-xs truncate italic ${unreadCount > 0 ? "text-gray-200 font-medium not-italic" : "text-gray-500"}`}>
                        {lastMessage ? lastMessage.content : "Tap to open signal..."}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-[10px] md:text-xs text-gray-600 px-2 md:px-3 italic">No threads found.</p>
            )}
          </div>
        </div>

        {/* Following / Start New Section */}
        <div>
          <p className="text-[9px] md:text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] px-2 md:px-3 mb-3 md:mb-4">Trusted Oracles</p>
          <div className="space-y-1">
            {following.length > 0 ? (
              following.map((u) => (
                <div
                  key={u._id}
                  onClick={() => onCreateChat(u._id)}
                  className="flex items-center gap-3 p-2.5 md:p-3 rounded-xl md:rounded-2xl cursor-pointer hover:bg-white/5 transition-all text-gray-400 hover:text-white group"
                >
                  <div className="shrink-0">
                    {u.image ? (
                      <img src={u.image} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-white/10 group-hover:border-[var(--primary-color)]/30 transition-colors" />
                    ) : (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold border border-white/10 group-hover:border-[var(--primary-color)]/30 transition-colors">
                        {u.firstName?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.firstName} {u.lastName}</p>
                    <p className="text-[9px] md:text-[10px] text-gray-600 truncate">@{u.userName}</p>
                  </div>
                  <Plus size={14} md:size={16} className="text-gray-600 group-hover:text-[var(--primary-color)] opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              ))
            ) : (
              <p className="text-[10px] md:text-xs text-gray-600 px-2 md:px-3 italic">The circle is quiet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatList;