import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

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
        const res = await axios.get(`http://localhost:3000/users/${user._id}/following`, {
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
        <img
          src={
            chat.participants.find((p) => p._id !== userId)?.image ||
            "https://picsum.photos/30/30"
          }
          alt="avatar"
          className="w-8 h-8 rounded-full mr-3"
        />
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
        <img
          src={u.image || "https://picsum.photos/30/30"}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-3"
        />
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