import express from "express";
import { verifyTokenAndAuthorization } from "../middlewares/verifyToken.js";
import { getUserChats, sendMessage } from "../controllers/chat.js";

const router = express.Router();

router.post("/get-chats/:id", verifyTokenAndAuthorization, getUserChats);

router.post("/:id", verifyTokenAndAuthorization, sendMessage);

export default router;
