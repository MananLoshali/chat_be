import express from "express";
import { verifyTokenAndAuthorization } from "../middlewares/verifyToken.js";
import {
  getUserChats,
  markAsRead,
  markAsReceived,
  sendMessage,
} from "../controllers/chat.js";

const router = express.Router();

router.post("/get-chats/:id", verifyTokenAndAuthorization, getUserChats);

router.post(
  "/mark-as-received/:messageId",
  verifyTokenAndAuthorization,
  markAsReceived
);

router.post(
  "/mark-as-read/:messageId",
  verifyTokenAndAuthorization,
  markAsRead
);

router.post("/:id", verifyTokenAndAuthorization, sendMessage);

export default router;
