import Chat from "../schema/Chat.js";

export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    if (!sender || !receiver || !message) {
      res.status(400).json({ msg: "All fileds are required", success: false });
      return;
    }
    const chat = new Chat({
      sender,
      receiver,
      message,
    });
    const newChat = await chat.save();

    req.io
      .to(receiver)
      .emit("receiveMessage", { sender, message: newChat.message });

    req.io
      .to(sender)
      .emit("receiveMessage", { sender, message: newChat.message });
    console.log(`Message emmited to room ${receiver}; ${newChat.message}`);

    res.status(200).json({ msg: "Message send", success: true, newChat });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const { user, receiver } = req.body;
    const chat = await Chat.find({
      $or: [
        { sender: user, receiver: receiver },
        { sender: receiver, receiver: user },
      ],
    }).sort({ timestamp: 1 });
    if (!chat) {
      res.status(400).json({ msg: "No chats found", success: false });
      return;
    }
    res.status(200).json({ msg: "Chats fetched", success: true, chat });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};
