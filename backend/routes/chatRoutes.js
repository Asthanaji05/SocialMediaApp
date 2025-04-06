import express from "express";
import { createChat, sendMessage, getUserChats } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:userId", getUserChats);
router.post("/create", createChat);
router.post("/send", sendMessage);

export default router;