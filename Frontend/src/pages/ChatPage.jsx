import React, { useEffect, useState, useCallback } from "react";
import API from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import ChatList from "../components/Chat/ChatList";
import ChatWindow from "../components/Chat/ChatWIndow";
import Loading from "../components/ui/Loading";
import { MessageSquareOff, ArrowLeft } from "lucide-react";
import socket from "../utils/socket";

const ChatPage = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [following, setFollowing] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  // Request Notification Permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Detect mobile view and handle responsive behavior
  useEffect(() => {
    const checkMobileView = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (mobile && selectedChat) {
        setShowChatList(false);
      } else if (!mobile) {
        setShowChatList(true);
      }
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, [selectedChat]);

  const markAsRead = useCallback(async (chatId) => {
    if (!user || !chatId) return;
    try {
      const token = localStorage.getItem("token");
      await API.post("/chats/read", { chatId, userId: user._id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Notify other participants via socket
      socket.emit("readMessages", { chatId, userId: user._id });

      // Locally update state to clear unread locally
      setChats(prev => prev.map(c => {
        if (c._id === chatId) {
          return {
            ...c,
            messages: c.messages.map(m => ({ ...m, read: m.sender._id !== user._id ? true : m.read }))
          };
        }
        return c;
      }));
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, [user]);

  // --- Socket Listeners ---
  useEffect(() => {
    if (!user) return;

    socket.on("newMessage", (messageData) => {
      // 1. Update the chat window if the transmission belongs to the active corridor
      setSelectedChat((prev) => {
        if (prev && prev._id === messageData.chatId) {
          const messageExists = prev.messages.some(m => m._id === messageData._id);
          if (messageExists) return prev;

          // If the chat is open, immediately mark as read
          markAsRead(messageData.chatId);

          return {
            ...prev,
            messages: [...prev.messages, messageData]
          };
        }
        return prev;
      });

      // 2. Update the sidebar preview list
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === messageData.chatId
            ? { ...chat, messages: [...(chat.messages || []), messageData] }
            : chat
        )
      );

      // 3. Browser Notification if not active or not in that chat
      const isOtherSender = (typeof messageData.sender === 'string' ? messageData.sender : messageData.sender._id) !== user._id;
      if (isOtherSender && (!selectedChat || selectedChat._id !== messageData.chatId)) {
        if (Notification.permission === "granted") {
          new Notification("New Transmission", {
            body: `${messageData.sender.userName || 'Oracle'}: ${messageData.content}`,
            icon: "/favicon.ico" // You might want to use the sender's image here if possible
          });
        }
      }
    });

    socket.on("messagesRead", ({ chatId, userId: readingUserId }) => {
      // If others read our messages, update the read ticks
      if (readingUserId !== user._id) {
        setSelectedChat(prev => {
          if (prev && prev._id === chatId) {
            return {
              ...prev,
              messages: prev.messages.map(m => ({ ...m, read: true }))
            };
          }
          return prev;
        });

        setChats(prev => prev.map(c => {
          if (c._id === chatId) {
            return {
              ...c,
              messages: c.messages.map(m => ({ ...m, read: true }))
            };
          }
          return c;
        }));
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("messagesRead");
    };
  }, [user, selectedChat, markAsRead]);

  // Sync with the room and mark as read when selecting
  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("joinChat", selectedChat._id);
      markAsRead(selectedChat._id);
    }
  }, [selectedChat?._id, markAsRead]);

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
      
      // On mobile, switch to chat view after selection
      if (isMobileView) {
        setShowChatList(false);
      }
    } catch (error) {
      console.error("Error selecting or creating chat:", error);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    if (isMobileView) {
      setSelectedChat(null);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    if (isMobileView) {
      setShowChatList(false);
    }
  };

  const sendMessage = async (message) => {
    if (!selectedChat) return;

    try {
      const response = await API.post("/chats/send", {
        chatId: selectedChat._id,
        sender: user._id,
        content: message,
      });

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
    <div className="min-h-screen bg-black text-white pt-20 px-2 md:px-6">
      <div className="max-w-7xl mx-auto h-[85vh] md:h-[85vh] flex overflow-hidden bg-[#0f0f0f] border border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl relative">

        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-[var(--primary-color)]/5 blur-[80px] md:blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-[var(--primary-color)]/5 blur-[100px] md:blur-[150px] pointer-events-none"></div>

        {user ? (
          <>
            {/* Mobile: Show Chat List or Chat Window */}
            {isMobileView ? (
              <>
                {/* Chat List View */}
                {showChatList ? (
                  <div className="w-full h-full relative z-10">
                    <ChatList
                      chats={chats}
                      following={following}
                      userId={user._id}
                      onSelectChat={handleSelectChat}
                      onCreateChat={handleSelectOrCreateChat}
                      selectedChatId={selectedChat?._id}
                    />
                  </div>
                ) : (
                  /* Chat Window View */
                  <div className="w-full h-full flex flex-col relative z-10">
                    {selectedChat ? (
                      <>
                        {/* Mobile Back Button */}
                        <div className="px-4 py-3 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center gap-3">
                          <button
                            onClick={handleBackToList}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                          >
                            <ArrowLeft size={20} />
                          </button>
                          <div className="flex items-center gap-3 flex-1">
                            {selectedChat.participants.find(p => p._id !== user._id)?.image ? (
                              <img 
                                src={selectedChat.participants.find(p => p._id !== user._id).image} 
                                className="w-8 h-8 rounded-full object-cover border border-white/10" 
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                                {selectedChat.participants.find(p => p._id !== user._id)?.firstName?.[0]}
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-white text-sm">
                                {selectedChat.participants.find(p => p._id !== user._id)?.firstName} {selectedChat.participants.find(p => p._id !== user._id)?.lastName}
                              </h3>
                              <p className="text-[9px] text-[var(--primary-color)] font-bold uppercase tracking-wider opacity-80">Signal Active</p>
                            </div>
                          </div>
                        </div>
                        <ChatWindow
                          selectedChat={selectedChat}
                          currentUserId={user._id}
                          onSendMessage={sendMessage}
                          isMobile={true}
                        />
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                          <MessageSquareOff size={32} className="text-gray-700" />
                        </div>
                        <h3 className="text-xl font-bungee text-gray-400 mb-2">No Active Orbit</h3>
                        <p className="font-borel text-sm max-w-xs">Select a trusted creator to begin a private transmission.</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Desktop: Side-by-side layout */
              <>
                {/* Sidebar Container */}
                <div className="w-full md:w-80 lg:w-96 border-r border-white/5 h-full relative z-10">
                  <ChatList
                    chats={chats}
                    following={following}
                    userId={user._id}
                    onSelectChat={handleSelectChat}
                    onCreateChat={handleSelectOrCreateChat}
                    selectedChatId={selectedChat?._id}
                  />
                </div>

                {/* Window Container */}
                <div className="hidden md:flex flex-1 h-full flex-col relative z-10">
                  {selectedChat ? (
                    <ChatWindow
                      selectedChat={selectedChat}
                      currentUserId={user._id}
                      onSendMessage={sendMessage}
                      isMobile={false}
                    />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8 text-center">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <MessageSquareOff size={40} className="text-gray-700" />
                      </div>
                      <h3 className="text-2xl font-bungee text-gray-400 mb-2">No Active Orbit</h3>
                      <p className="font-borel max-w-xs">Select a trusted creator from the side to begin a private transmission.</p>
                    </div>
                  )}
                </div>
              </>
            )}
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
