import mongoose from "mongoose";
import User from "../schema/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res
      .status(200)
      .json({ msg: "User fetched succesfully", success: true, users });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};

export const getContactUsers = async (req, res) => {
  try {
    const user = req.user;
    const contactUsers = await User.findById(user.id).populate(
      "contacts",
      "name email image"
    );
    res.status(200).json({ msg: "User fetched", success: true, contactUsers });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};

export const addUserToContact = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = req.user;

    const isUser = await User.findById(user.id);
    if (!isUser || !userId) {
      res.status(404).json({ msg: "User not found", success: false });
      return;
    }
    if (!isUser.contacts.includes(userId)) {
      isUser.contacts.push(new mongoose.Types.ObjectId(userId));
    } else {
      return res
        .status(400)
        .json({ msg: "User already in contacts", success: false });
    }
    await isUser.save();
    res.status(200).json({ msg: "User added to contact", success: true });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};
