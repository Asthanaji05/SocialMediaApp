import Chats from "../models/Chats.js";

// Fetch chats for a user
export const getUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chats.find({ participants: userId })
      .populate("participants", "firstName lastName userName image")
      .populate("messages.sender", "firstName lastName userName image");
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};;

// Create a new chat
export const createChat = async (req, res) => {
  const { participants } = req.body;

  if (!participants || participants.length < 2) {
    return res.status(400).json({ message: "At least two participants are required." });
  }

  try {
    // Check if a chat already exists between the participants
    const existingChat = await Chats.findOne({
      participants: { $all: participants, $size: 2 },
    });

    if (existingChat) {
      return res.status(200).json(existingChat); // Return the existing chat
    }

    // Create a new chat if it doesn't exist
    const newChat = new Chats({ participants });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  const { chatId, sender, content } = req.body;

  if (!chatId || !sender || !content) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const chat = await Chats.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    const newMessage = { sender, content };
    chat.messages.push(newMessage);
    await chat.save();

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};