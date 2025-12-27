import express from "express";
import { createChat, sendMessage, getUserChats, markMessagesAsRead } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:userId", getUserChats);
router.post("/create", createChat);
router.post("/send", sendMessage);
router.post("/read", markMessagesAsRead);

export default router;