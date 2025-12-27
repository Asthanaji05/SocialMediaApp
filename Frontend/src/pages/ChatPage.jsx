import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import ChatList from "../components/Chat/ChatList";
import ChatWindow from "../components/Chat/ChatWIndow";
import Loading from "../components/UI/Loading";
import { MessageSquareOff } from "lucide-react";
import { io } from "socket.io-client";

// Initialize socket - connect to backend port 3000
const socket = io("http://localhost:3000", { withCredentials: true });

const ChatPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [following, setFollowing] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Socket Listeners ---
  useEffect(() => {
    if (!user) return;

    // Listen for incoming signals (messages)
    socket.on("newMessage", (messageData) => {
      // console.log("Incoming signal detected:", messageData);

      // 1. Update the chat window if the transmission belongs to the active corridor
      setSelectedChat((prev) => {
        if (prev && prev._id === messageData.chatId) {
          // Check for existing message to avoid duplicates from echo
          const messageExists = prev.messages.some(m => m._id === messageData._id);
          if (messageExists) return prev;

          return {
            ...prev,
            messages: [...prev.messages, messageData]
          };
        }
        return prev;
      });

      // 2. Update the sidebar preview list so the latest signal shows up
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === messageData.chatId
            ? { ...chat, messages: [...(chat.messages || []), messageData] }
            : chat
        )
      );
    });

    return () => {
      socket.off("newMessage");
    };
  }, [user]);

  // Synchronize with the room whenever the selected chat changes
  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("joinChat", selectedChat._id);
    }
  }, [selectedChat?._id]);

  useEffect(() => {
    if (!user || !user._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [followingRes, chatsRes] = await Promise.all([
          API.get(`/users/${user._id}/following`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get(`/chats/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);
        setFollowing(followingRes.data);
        setChats(chatsRes.data);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSelectOrCreateChat = async (userId) => {
    try {
      const response = await API.post("/chats/create", {
        participants: [user._id, userId],
      });

      const existingChat = chats.find((chat) => chat._id === response.data._id);
      if (!existingChat) {
        setChats((prevChats) => [...prevChats, response.data]);
      }
      setSelectedChat(response.data);
    } catch (error) {
      console.error("Error selecting or creating chat:", error);
    }
  };

  const sendMessage = async (message) => {
    if (!selectedChat) return;

    try {
      // First, save the signal to the database via REST
      const response = await API.post("/chats/send", {
        chatId: selectedChat._id,
        sender: user._id,
        content: message,
      });

      // Then, broadcast the transmission to the corridor via Socket.io
      socket.emit("sendMessage", {
        ...response.data,
        chatId: selectedChat._id
      });

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading && !user) return <Loading />;

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto h-[85vh] flex overflow-hidden bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] shadow-2xl relative">

        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--primary-color)]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--primary-color)]/5 blur-[150px] pointer-events-none"></div>

        {user ? (
          <>
            {/* Sidebar Container */}
            <div className="w-full md:w-80 lg:w-96 border-r border-white/5 h-full relative z-10">
              <ChatList
                chats={chats}
                following={following}
                userId={user._id}
                onSelectChat={setSelectedChat}
                onCreateChat={handleSelectOrCreateChat}
                selectedChatId={selectedChat?._id}
              />
            </div>

            {/* Window Container */}
            <div className="flex-1 h-full flex flex-col relative z-10">
              {selectedChat ? (
                <ChatWindow
                  selectedChat={selectedChat}
                  currentUserId={user._id}
                  onSendMessage={sendMessage}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <MessageSquareOff size={40} className="text-gray-700" />
                  </div>
                  <h3 className="text-2xl font-nerko text-gray-400 mb-2">No Active Orbit</h3>
                  <p className="font-borel max-w-xs">Select a trusted creator from the side to begin a private transmission.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
