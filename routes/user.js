import express from "express";
import { verifyTokenAndAuthorization } from "../middlewares/verifyToken.js";
import {
  addUserToContact,
  getAllUsers,
  getContactUsers,
} from "../controllers/user.js";

const router = express.Router();

router.get("/contact/:id", verifyTokenAndAuthorization, getContactUsers);

router.post("/add-user/:id", verifyTokenAndAuthorization, addUserToContact);

router.get("/:id", verifyTokenAndAuthorization, getAllUsers);

export default router;
