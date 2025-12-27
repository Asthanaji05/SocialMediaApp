import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../utils/api.js";

const ChatList = ({ chats, following, userId, onCreateChat, onSelectChat }) => {
  const { user } = useAuth();
  const [followingUsers, setFollowingUsers] = useState([]);
  const uniqueChats = chats.filter(
    (chat, index, self) =>
      index === self.findIndex((c) => c._id === chat._id)
  );

  useEffect(() => {
    const fetchFollowingUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token
        const res = await API.get(`/users/${user._id}/following`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the request headers
          },
        });
        setFollowingUsers(res.data);
      } catch (err) {
        console.error("Error fetching following users:", err);
      }
    };

    if (user?._id) fetchFollowingUsers();
  }, [user]);

  return (
    <div className="w-64 h-screen bg-black text-white p-4">
      <h3 className="text-lg font-semibold mb-4">Chats</h3>
      {uniqueChats.length > 0 ? (
        uniqueChats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className="flex items-center mb-3 cursor-pointer hover:bg-slate-700 p-2 rounded-lg"
          >
            {(() => {
              const targetUser = chat.participants.find((p) => p._id !== userId);
              return targetUser?.image ? (
                <img
                  src={targetUser.image}
                  alt="avatar"
                  className="w-10 h-10 rounded-full mr-3 object-cover border border-white/10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold mr-3 border border-white/10 shrink-0">
                  {targetUser?.firstName?.[0]}
                </div>
              );
            })()}
            <span className="text-sm">
              {chat.participants
                .filter((p) => p._id !== userId)
                .map((p) => p.firstName)
                .join(", ")}
            </span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400">No chats available</p>
      )}

      <h3 className="text-lg font-semibold mt-6 mb-4">Following</h3>
      {following.length > 0 ? (
        following.map((u) => (
          <div
            key={u._id}
            onClick={() => onCreateChat(u._id)}
            className="flex items-center mb-3 cursor-pointer hover:bg-slate-700 p-2 rounded-lg"
          >
            {u.image ? (
              <img
                src={u.image}
                alt="avatar"
                className="w-10 h-10 rounded-full mr-3 object-cover border border-white/10"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold mr-3 border border-white/10 shrink-0">
                {u.firstName?.[0]}
              </div>
            )}
            <span className="text-sm">{u.firstName} ({u.userName})</span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400">No following users</p>
      )}
    </div>

  );
};

export default ChatList;