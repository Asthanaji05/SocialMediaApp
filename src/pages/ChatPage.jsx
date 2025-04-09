import React, { useEffect, useState } from "react";
import API from "../utils/api"; // Replace axiosInstance with API
import { useAuth } from "../contexts/AuthContext";
import ChatList from "../components/Chat/ChatList";
import ChatWindow from "../components/Chat/ChatWIndow";

const ChatPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [following, setFollowing] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get(`/users/${user._id}/following`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFollowing(response.data);
      } catch (error) {
        console.error("Error fetching following users:", error);
      }
    };

    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching chats for user:", user._id);
        const response = await API.get(`/chats/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Chats fetched successfully:", response.data);
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
    fetchFollowing();
  }, [user, setFollowing]);

  const createChat = async (userId) => {
    console.log("Creating chat with userId:", userId);
    try {
      const response = await API.post("/chats/create", {
        participants: [user._id, userId],
      });
      console.log("Chat created successfully:", response.data);
      setChats((prevChats) => [...prevChats, response.data]);
      setSelectedChat(response.data);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleSelectOrCreateChat = async (userId) => {
    try {
      // Check if a chat already exists or create a new one
      const response = await API.post("/chats/create", {
        participants: [user._id, userId],
      });
      console.log("Chat fetched or created successfully:", response.data);

      // Check if the chat already exists in the state
      const existingChat = chats.find((chat) => chat._id === response.data._id);
      if (!existingChat) {
        setChats((prevChats) => [...prevChats, response.data]);
      }

      // Select the chat
      setSelectedChat(response.data);
    } catch (error) {
      console.error("Error selecting or creating chat:", error);
    }
  };

  const sendMessage = async (message) => {
    if (!selectedChat) return;

    console.log("Sending message:", message);
    try {
      const response = await API.post("/chats/send", {
        chatId: selectedChat._id,
        sender: user._id,
        content: message,
      });
      console.log("Message sent successfully:", response.data);

      // Update the selected chat with the new message
      // setSelectedChat((prevChat) => ({
      //   ...prevChat,
      //   messages: [...prevChat.messages, response.data],
      // }));

      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, response.data],
      };
      
      setSelectedChat(null);
      setTimeout(() => setSelectedChat(updatedChat), 0);
      
      // Update the chats state with the new message
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, messages: [...chat.messages, response.data] }
            : chat
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {user ? (
        <>
          <ChatList
            chats={chats}
            following={following}
            userId={user._id}
            onSelectChat={setSelectedChat}
            onCreateChat={handleSelectOrCreateChat} // Updated to use the new logic
          />
          <ChatWindow
            selectedChat={selectedChat}
            currentUserId={user._id}
            onSendMessage={sendMessage}
          />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ChatPage;
