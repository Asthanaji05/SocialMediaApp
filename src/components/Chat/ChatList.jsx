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
    <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "10px" }}>
    <h3>Chats</h3>
    {uniqueChats.length > 0 ? (
      uniqueChats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onSelectChat(chat)}
          style={{
            cursor: "pointer",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={
              chat.participants.find((p) => p._id !== userId)?.image ||
              "https://placehold.co/30x30"
            }
            alt="avatar"
            width="30"
            height="30"
            style={{ borderRadius: "50%", marginRight: "10px" }}
          />
          <span>
            {chat.participants
              .filter((p) => p._id !== userId)
              .map((p) => p.firstName)
              .join(", ")}
          </span>
        </div>
      ))
    ) : (
      <p>No chats available</p>
    )}
    <h3>Following</h3>
    {following.length > 0 ? (
      following.map((u) => (
        <div
          key={u._id}
          onClick={() => onCreateChat(u._id)}
          style={{
            cursor: "pointer",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={u.image || "https://placehold.co/30x30"}
            alt="avatar"
            width="30"
            height="30"
            style={{ borderRadius: "50%", marginRight: "10px" }}
          />
          <span>{u.firstName} ({u.userName})</span>
        </div>
      ))
    ) : (
      <p>No following users</p>
    )}
  </div>
);
};

export default ChatList;